#include "GameState.hpp"

#include "GenericResponses.hpp"
#include "RequestVerification.hpp"

GameState::GameState(int _game_id, string _map_file)
{
    current_gamestate = State::WAITING_FOR_PLAYERS;
    build_map_from_file(_map_file);
    player_one == NULL;
    player_two == NULL;
    player_turn = 1;
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

    // TODO - keep track of units that have moved and done stuff
    // also change turns when all things have been done

    // Otherwise, we should just return TRUE.
    return true;
}

void GameState::handle_request(Player *p, EventRequest *r)
{
    // Depending on the type, we do different things.
    string type = (*r)["type"].asString();
    if(type.compare("AssignGameRequest") == 0)
    {
        handle_assign_game(p, r);
    }
    else if(type.compare("UnitSelectionRequest") == 0)
    {
        handle_unit_selection(p, r);
    }
    else if(type.compare("UnitMoveRequest") == 0)
    {
        handle_unit_move(p, r);
    }
    else if(type.compare("UnitInteractRequest") == 0)
    {
        handle_unit_interact(p, r);
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

void GameState::handle_assign_game(Player *p, EventRequest *r)
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

bool GameState::tile_reachable(int distance, int x, int y, int to_x, int to_y)
{
    // Verify that the current (x,y) are not outside the map.
    if(x < 0 || y < 0 || x >= map_width || y >= map_height)
    {
        return false;
    }

    // Verify that this location isn't blocked.
    if(blocked_tiles[x][y] == true)
    {
        return false;
    }

    // If we can't go any farther...
    if(distance < 1)
    {
        if(x == to_x && y == to_y)
        {
            return true;
        }
        return false;
    }

    // However, if we can go further, let's try.
    return tile_reachable(distance - 1, x + 1, y, to_x, to_y)
        || tile_reachable(distance - 1, x - 1, y, to_x, to_y)
        || tile_reachable(distance - 1, x, y + 1, to_x, to_y)
        || tile_reachable(distance - 1, x, y - 1, to_x, to_y);
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
    if(!unit->is_alive() || !target->is_alive())
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

void GameState::handle_unit_move(Player *p, EventRequest *r)
{
    // First verify that the event is valid.
    if(!verify_unit_move(r))
    {
        notify_invalid_request(p->get_connection(), r);
        return;
    }

    // Since it's valid, let's grab the Unit and its intended destination.
    int unit_id = (*r)["unit_id"].asInt();
    int x = (*r)["x"].asInt();
    int y = (*r)["y"].asInt();
    if(unit_id >= units.size())
    {
        notify_illegal_request(p->get_connection(), r);
        return;
    }
    Unit *unit = units[unit_id];
    if(!unit->is_alive())
    {
        notify_illegal_request(p->get_connection(), r);
        return;
    }

    // See if the Unit can move to that tile.
    if(!tile_reachable(unit->get_move_distance(), unit->get_x(), unit->get_y(), x, y))
    {
        notify_illegal_request(p->get_connection(), r);
        return;
    }

    // If we can move, go ahead annd move then!
    unit->set_position(x, y);
    notify_unit_move(r, unit);
}

void GameState::handle_unit_selection(Player *p, EventRequest *r)
{
    // Veirfy that the request has all necessary fields.
    if(!verify_unit_selection(r))
    {
        notify_invalid_request(p->get_connection(), r);
        return;
    }

    // Get all Unit types.
    UnitType types[5];
    types[0] = string_to_unit_type((*r)["first"].asString());
    types[1] = string_to_unit_type((*r)["second"].asString());
    types[2] = string_to_unit_type((*r)["third"].asString());
    types[3] = string_to_unit_type((*r)["fourth"].asString());
    types[4] = string_to_unit_type((*r)["fifth"].asString());

    // Verify they're all valid.
    for(int i = 0; i < 5; ++i)
    {
        if(types[i] == INVALID)
        {
            notify_invalid_request(p->get_connection(), r);
            return;
        }
    }

    // Go ahead and create the units.
    for(int i = 0; i < 5; ++i)
    {
        units.push_back(new Unit(units.size(), types[i], p->get_player_id()));
    }

    // And notify the Player that we're all good.
    notify_select_units(r, p);
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
    // Build the event.
    Event notify;
    notify["type"] = string("SelectUnitsEvent");
    notify["game_id"] = game_id;
    notify["message_id"] = (*r)["message_id"];
    notify["player_id"] = p->get_player_id();

    send_all_players(notify);
}

void GameState::notify_state_change(EventRequest *r)
{
    // Determine the state string based on state.
    string state = "";
    switch(current_gamestate)
    {
        case WAITING_FOR_PLAYERS:
            state = "WAITING_FOR_PLAYERS";
            break;
        case UNIT_SELECTION:
            state = "UNIT_SELECTION";
            break;
        case GAME_PLAYING:
            state = "GAME_PLAYING";
            break;
        case GAME_OVER:
            state = "GAME_OVER";
    }

    // Build the Event
    Event notify;
    notify["type"] = string("StateChangeEvent");
    notify["game_id"] = game_id;
    notify["message_id"] = (*r)["message_id"];
    notify["state"] = state;

    // Send to all connected players.
    send_all_players(notify);
}

void GameState::notify_turn_change(EventRequest *r)
{
    // Change the player_turn.
    if (player_turn == 1)
    {
        player_turn = 2;
    }
    else
    {
        player_turn = 1;
    }

    // Build the Event
    Event notify;
    notify["type"] = string("TurnChangeEvent");
    notify["game_id"] = game_id;
    notify["message_id"] = (*r)["message_id"];
    notify["player_turn"] = player_turn;

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
    notify["unit_id"] = uid1;
    notify["target_id"] = uid2;
    notify["unit_hp"] = first->get_remaining_health();
    notify["target_hp"] = second->get_remaining_health();

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
