#include "Connection.hpp"
#include "Game.hpp"
#include "GenericResponses.hpp"
#include "LogWriter.hpp"
#include "NetworkManager.hpp"
#include "Player.hpp"

#include <map>
#include <unistd.h>

void handle_assign_game_request(Player *p, EventRequest *r,
        map<int, Game*> &games, int &highest_game_id, MapInfo *map, LogWriter *log)
{
    // First, let's make sure they aren't already in a game.
    if(p->get_game_id() != 0)
    {
        log->write("[MAIN] WARN: Player is already in a Game.");
        notify_illegal_request(p->get_connection(), r);
        return;
    }

    // So a game_id was provided! Make sure it's valid number.
    int game_id = (*r)["game_id"].asInt();
    if(game_id != -1 && game_id != -2 && games.find(game_id) == games.end())
    {
        log->write("[MAIN] WARN: The specified game_id is invalid.");
        notify_illegal_request(p->get_connection(), r);
        return;
    }

    // If game_id is -2, they want a new game to be created for them.
    if(game_id == -2)
    {
        log->write("[MAIN] INFO: Creating new Game for Player.");
        ++highest_game_id;
        games[highest_game_id] = new Game(log, highest_game_id, map);
        game_id = highest_game_id;
    }

    // If game_id is -1, they want a random existing game. Otherwise we'll make a game for them.
    else if(game_id == -1)
    {
        log->write("[MAIN] INFO: Attempting to assign Player to an existing open Game.");
        // Try to put them in an existing game.
        for(pair<int, Game*> pi : games)
        {
            if(pi.second->needs_player())
            {
                log->write("[MAIN] INFO: Found game, assigning Player.");
                game_id = pi.second->get_game_id();
                break;
            }
        }

        // If they didn't get put in an existing game, go ahead and make one.
        if(game_id == -1)
        {
            log->write("[MAIN] INFO: No games open. Creating new Game.");
            ++highest_game_id;
            games[highest_game_id] = new Game(log, highest_game_id, map);
            game_id = highest_game_id;
        }
    }

    // If all else fails, they wanted a specific game.
    else
    {
        log->write("[MAIN] INFO: Specific Game requested. Attempting to assign Player to game.");
        game_id = p->get_game_id();
    }

    // One last time, make sure the Game actually needs a Player.
    if(!games[game_id]->needs_player())
    {
        log->write("[MAIN] WARN: Cannot assign Player to Game, already full.");
        notify_illegal_request(p->get_connection(), r);
        return;
    }

    // Notify the game to add the Player
    char buffer[2048];
    sprintf(buffer, "[MAIN] INFO: Passing Event to Game ID %d.", game_id);
    log->write(buffer);
    games[game_id]->handle_request(p, r);
}

int main(int argc, char **argv)
{
    // initialize core components.
    LogWriter log;
    log.write("[MAIN] INFO: Starting RQ server, logging system initialized.");
    NetworkManager nm;
    init_networking_thread(&nm, &log);

    // important maps
    map<int, Player*> players;
    map<int, Game*> games;
    int highest_game_id = 0;

    MapInfo *map = new MapInfo(&log, "../client/assets/js/map1.json");

    // main event loop
    while(true)
    {
        // Used for any output messages...
        char buffer[2048];

        // If any new players connected, create a Player entity for them.
        for(Connection *c = nm.pop_new_connection(); c != NULL; c = nm.pop_new_connection())
        {
            players[c->get_id()] = new Player(c->get_id(), c);
            memset(buffer, 0, 2048);
            sprintf(buffer, "[MAIN] INFO: A new Player with ID %d has connected.", c->get_id());
            log.write(buffer);
        }

        // Let's go ahead and handle any outstanding event requests now.
        for(EventRequest *r = nm.pop_incoming_request(); r != NULL; r = nm.pop_incoming_request())
        {
            log.write("[MAIN] INFO: Processing incoming EventRequest.");

            // Get the requesting player.
            int player_id = (*r)["player_id"].asInt();
            int game_id = (*r)["game_id"].asInt();
            Player *p = players[player_id];
            string type = (*r)["type"].asString();

            memset(buffer, 0, 2048);
            sprintf(buffer, "[MAIN] INFO: EventRequest with ID %d belongs to Player with ID %d has connected.",
                    (*r)["request_id"].asInt(), player_id);
            log.write(buffer);

            // AssignGameRequest
            if(type.compare("AssignGameRequest") == 0)
            {
                log.write("[MAIN] Handling AssignGameRequest.");
                handle_assign_game_request(p, r, games, highest_game_id, map, &log);
            }

            // PlayerQuitRequest
            else if(type.compare("PlayerQuitRequest") == 0)
            {
                log.write("[MAIN] INFO: Processing PlayerQuitRequest.");
                // First notify the Game.
                games[p->get_game_id()]->handle_request(p, r);

                // TODO make it so that a disconnection automatically triggers this.

                // Then disconnect/delete the Player.
                nm.kill_connection(p->get_player_id());
                players.erase(p->get_player_id());
                delete p;
            }

            // All other requests just go straight to the Game.
            else
            {
                memset(buffer, 0, 2048);
                sprintf(buffer, "[MAIN] INFO: Passing EventRequest on to the appropriate Game with ID %d.", game_id);
                log.write(buffer);

                // Verify that the game exists before trying to do things.
                if(games.find(game_id) == games.end())
                {
                    log.write("[MAIN] WARN: Player attempted to send request to non-existant Game.");
                    continue;
                }

                // Verify that the Player is in this Game.
                if(game_id != p->get_game_id())
                {
                    log.write("[MAIN] WARN: Player attempted to send request to a Game they are not in.");
                    continue;
                }

                // Go ahead and pass it on!
                games[p->get_game_id()]->handle_request(p, r);
            }
        }

        // Tick all of the Games and remove the completed ones.
        vector<int> remove;
        for(pair<int, Game*> p : games)
        {
            // TODO keep time!
            if(!p.second->tick(0))
            {
                remove.push_back(p.first);
            }
        }
        for(int i : remove)
        {
            memset(buffer, 0, 2048);
            sprintf(buffer, "[MAIN] INFO: Deleting Game %d because a Player has quit.", i);
            log.write(buffer);
            delete games[i];
            games.erase(i);
        }

        // Sleep for a bit. Don't want our poor server to die.
        usleep(250);
    }

    // make sure to shutdown everything
    shutdown_networking_thread();

    delete map;

    // also need to delete used memory
    for(pair<int, Player*> p : players)
    {
        delete p.second;
    }
    for(pair<int, Game*> p : games)
    {
        delete p.second;
    }
    return 0;
}
