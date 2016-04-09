#include "GameState.hpp"

#include "GenericResponses.hpp"

GameState::GameState(int _game_id, string _map_file)
{
    current_gamestate = State::WAITING_FOR_PLAYERS;
    build_map_from_file(_map_file);
    player_one == NULL;
    player_two == NULL;
}

GameState::~GameState()
{
    for(pair<int, TileInfo*> tp : tiles)
    {
        delete tp.second;
    }
    for(Unit *u : units)
    {
        delete u;
    }
}

bool GameState::tick(double time_in_seconds)
{
    // If the state is GAME_OVER, just return FALSE.
    if(current_gamestate == State::GAME_OVER)
    {
        return false;
    }

    // If the state is GAME_PLAYING, deduct the seconds.
    if(current_gamestate == State::GAME_PLAYING)
    {
        // TODO - actually keep track of time maybe
    }

    // Otherwise, we should just return TRUE.
    return true;
}

void GameState::handle_request(Player *p, EventRequest *r)
{
    // After everything is done, delete the EventRequest.
    delete r;
}

void GameState::add_player(Player *p)
{
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
}

bool GameState::needs_player()
{
    return player_one == NULL || player_two == NULL;
}

void GameState::build_map_from_file(string &map_filename)
{
    // If we weren't able to load the map, don't start the game.
    current_gamestate = State::GAME_OVER;
    
    Json::Value map_data;
    Json::Reader reader;
    bool parsingSuccessful = reader.parse(map_filename, map_data);
    if(!parsingSuccessful)
    {
        // report failure and their locations in the document to the user
        cout << "Failed to parse configuration\n" << reader.getFormattedErrorMessages();
        return;
    }    
    
    Json::Value height = map_data["height"];
    Json::Value width = map_data["width"];
    const Json::Value layers = map_data["layers"];
    for (int index = 0; index < layers.size(); ++index)
        if(layer[i]["name"].asString().compare("blockedLayer") == 0)
        {
           const Json::value blocked_data = layer[i]["data"];
           break;
        }
    for (int index = 0; index < blocked_data.size(); ++index)
        int tile_data = layer[i].asInt();
        if(tile_data != 0)
        {
            tiles[i] = tile_data;
        }
    Json::Value next_object_id = map_data["nextobjectid"];
    Json::Value orientation = map_data["orientation"];
    Json::Value render_order = map_data["renderorder"];
    Json::Value tile_height = map_data["tileheight"];
    Json::Value tile_width = map_data["tilewidth"];
    Json::Value tile_sets = map_data["tilesets"];
    Json::Value version = map_data["version"];    
}

/***
 *  EVENT NOTIFICATION
 **/

void GameState::send_all_players(Event &e)
{
    if(player_one != NULL)
    {
        player_one->get_connection()->submit_outgoing_event(e);
    }
    if(player_two != NULL)
    {
        player_two->get_connection()->submit_outgoing_event(e);
    }
}

void GameState::notify_assign_game(EventRequest *r)
{
    // First get the Player IDs
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

    // Build the Event
    Event notify;
    notify["type"] = string("AssignGameEvent");
    notify["game_id"] = game_id;
    notify["message_id"] = (*r)["message_id"];
    notify["player_one_id"] = pid1;
    notify["player_two_id"] = pid2;

    // Send to all connected players.
    send_all_players(notify);
}
