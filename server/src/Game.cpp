#include "Game.hpp"

#include "GenericResponses.hpp"
#include "RequestVerification.hpp"

Game::Game(int _game_id, string _map_file) : GameState(_game_id, NULL, NULL)
{
    // TODO fill in
}

Game::~Game()
{
    // TODO fill in
}

bool Game::tick(double time_in_seconds)
{
    // Otherwise, we should just return TRUE.
    return true;
}

void Game::handle_request(Player *p, EventRequest *r)
{
    // Depending on the type, we do different things.
    string type = (*r)["type"].asString();
    if(type.compare("AssignGameRequest") == 0)
    {
        handle_assign_game(p, r);
    }
    else if(type.compare("PlayerQuitRequest") == 0)
    {
        // TODO - actually handle this
    }
    else if(type.compare("RematchRequest") == 0)
    {
        // TODO - actually handle this
    }
    else
    {
        notify_invalid_request(p->get_connection(), r);
    }

    // After everything is done, delete the EventRequest.
    delete r;
}

void Game::handle_assign_game(Player *p, EventRequest *r)
{
    // Make sure we have room for the Player.
    if(!needs_player())
    {
        notify_illegal_request(p->get_connection(), r);
    }

    // Go ahead and add the Player.
    if(player_one = NULL)
    {
        player_one = p;
        p->set_game_id(game_id);
        return;
    }
    if(player_two = NULL)
    {
        player_two = p;
        p->set_game_id(game_id);
        return;
    }

    // Notify both Players.
    notify_assign_game(r);
}

bool Game::needs_player()
{
    return player_one == NULL || player_two == NULL;
}

void Game::notify_assign_game(EventRequest *r)
{
    // First get the Player IDs.
    int pid1 = -1;
    int pid2 = -1;
    if(player_one != NULL)
    {
        pid1 = player_one->get_player_id();
    }
    if(player_two != NULL)
    {
        pid2 = player_two->get_player_id();
    }

    // Next build the event.
    Event notify;
    notify["type"] = string("AssignGameEvent");
    notify["game_id"] = game_id;
    notify["message_id"] = (*r)["message_id"];
    notify["player_one_id"] = pid1;
    notify["player_two_id"] = pid2;

    send_all_players(notify);
}

void Game::notify_state_change(EventRequest *r)
{
    // Determine the state string based on state.
    string state = "";
    // TODO fix
    //switch(current_gamestate)
    //{
        //case WAITING_FOR_PLAYERS:
            //state = "WAITING_FOR_PLAYERS";
            //break;
        //case UNIT_SELECTION:
            //state = "UNIT_SELECTION";
            //break;
        //case GAME_PLAYING:
            //state = "GAME_PLAYING";
            //break;
        //case GAME_OVER:
            //state = "GAME_OVER";
    //}

    // Build the Event
    Event notify;
    notify["type"] = string("StateChangeEvent");
    notify["game_id"] = game_id;
    notify["message_id"] = (*r)["message_id"];
    notify["state"] = state;

    // Send to all connected players.
    send_all_players(notify);
}
