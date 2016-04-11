#include "GameState.hpp"

#include "GenericResponses.hpp"
#include "RequestVerification.hpp"

GameState::GameState(int _game_id, string _map_file)
{
    current_gamestate = State::WAITING_FOR_PLAYERS;
    build_map_from_file(_map_file);
    player_one == NULL;
    player_two == NULL;
}

GameState::~GameState()
{
    // Delete all Units
    for(Unit *u : units)
    {
        delete u;
    }

    // Delete the blocked_tiles array
    for(int i = 0; i < map_width; ++i)
    {
        delete blocked_tiles[i];
    }
    delete blocked_tiles;
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

void GameState::handle_unit_interact(Player *p, EventRequest *r)
{
    // Verify that both units exist and get them.
    if(!verify_unit_interact(r))
    {
        notify_invalid_request(p->get_connection(), r);
        return;
    }
    int unit_id = (*r)["unit_id"].asInt();
    int target_id = (*r)["target_id"].asInt();
    if(unit_id >= units.size() || target_id >= units.size())
    {
        notify_illegal_request(p->get_connection(), r);
        return;
    }
    Unit *unit = units[unit_id];
    Unit *target = units[target_id];
    if(unit == NULL || target == NULL)
    {
        notify_illegal_request(p->get_connection(), r);
        return;
    }

    // Cause the interaction and send off an event.
    if(!unit->interact(target))
    {
        notify_illegal_request(p->get_connection(), r);
        return;
    }
    notify_unit_interact(r, unit, target);
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

    // Setup the blocked_tiles array.
    blocked_tiles = new bool*[map_width];
    for(int i = 0; i < map_width; ++i)
    {
        blocked_tiles[i] = new bool[map_height];
        for(int j = 0; j < map_height; ++j)
        {
            blocked_tiles[i][j] = false;
        }
    }

    Json::Value map_data;
    Json::Reader reader;
    bool parsingSuccessful = reader.parse(map_filename, map_data);
    if(!parsingSuccessful)
    {
        // report failure and their locations in the document to the user
        cout << "Failed to parse configuration\n" << reader.getFormattedErrorMessages();
        return;
    }    

    map_height = map_data["height"].asInt();
    map_width = map_data["width"].asInt();
    const Json::Value layers = map_data["layers"];
    Json::Value blocked_data;
    for (int index = 0; index < layers.size(); ++index)
        if(layers[index]["name"].asString().compare("blockedLayer") == 0)
        {
            blocked_data = layers[index]["data"];
            break;
        }
    for (int index = 0; index < blocked_data.size(); ++index)
    {
        int tile_data = blocked_data[index].asInt();
        if(tile_data != 0)
        {
            int x = index / map_width;
            int y = index - x * map_width;
            blocked_tiles[x][y] = true;
        }
    }
    Json::Value next_object_id = map_data["nextobjectid"];
    Json::Value orientation = map_data["orientation"];
    Json::Value render_order = map_data["renderorder"];
    Json::Value tile_height = map_data["tileheight"];
    Json::Value tile_width = map_data["tilewidth"];
    Json::Value tile_sets = map_data["tilesets"];
    Json::Value version = map_data["version"];    
}

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

void GameState::notify_select_units(EventRequest *r, Player *p)
{
    
}

void GameState::notify_state_change(EventRequest *r)
{

}

void GameState::notify_turn_change(EventRequest *r)
{
    // Build the Event
    Event notify;
    notify["type"] = string("TurnChangeEvent");
    notify["game_id"] = game_id;
    notify["message_id"] = (*r)["message_id"];

    // Send to all connected players.
    send_all_players(notify);
}

void GameState::notify_unit_interact(EventRequest *r, Unit *first, Unit *second)
{
    // First get the Unit IDs
    int uid1 = -1;
    int uid2 = -1;
    if(first != NULL)
    {
        uid1 = first->get_unit_id();
    }
    if(second != NULL)
    {
        uid2 = second->get_unit_id();
    }

    // Build the Event
    Event notify;
    notify["type"] = string("UnitInteractEvent");
    notify["game_id"] = game_id;
    notify["message_id"] = (*r)["message_id"];
    notify["unit_one_id"] = uid1;
    notify["unit_two_id"] = uid2;
    notify["unit_one_hp"] = first->get_remaining_health();
    notify["unit_two_hp"] = second->get_remaining_health();

    // Send to all connected players.
    send_all_players(notify);
}

void GameState::notify_unit_move(EventRequest *r, Unit *target)
{
    // First get the Player IDs
    int uid = -1;
    if(target != NULL)
    {
        uid = target->get_unit_id();
    }

    // Build the Event
    Event notify;
    notify["type"] = string("UnitMoveEvent");
    notify["game_id"] = game_id;
    notify["message_id"] = (*r)["message_id"];
    notify["unit_id"] = uid;
    notify["unit_x"] = target->get_x();
    notify["unit_y"] = target->get_y();

    // Send to all connected players.
    send_all_players(notify);
}
