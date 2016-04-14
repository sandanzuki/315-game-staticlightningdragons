#include "PlayingState.hpp"

PlayingState::PlayingState(int _game_id, Player *_player_one, Player *_player_two,
        vector<Unit*> _units_one, vector<Unit*> _units_two, MapInfo *_map) :
        GameState(_game_id, _player_one, _player_two)
{
    units_one = _units_one;
    units_two = _units_two;
    map = _map;
    state_name = PLAYING;
    player_turn = 1;
    handle_turn_change(NULL, NULL);
}

void PlayingState::handle_request(Player *p, EventRequest *r)
{
    // Depending on the type, we do different things.
    string type = (*r)["type"].asString();
    if(type.compare("UnitMoveRequest") == 0)
    {
        handle_unit_move(p, r);
    }
    else if(type.compare("UnitInteractRequest") == 0)
    {
        handle_unit_interact(p, r);
    }
    else
    {
        notify_invalid_request(p->get_connection(), r);
    }
}

bool PlayingState::tick(double time)
{
    // TODO - maybe include a timer for timed stuff, ya know?
    
    // If the turn is over, change turns.
    bool turn_complete = true;
    if(player_turn == 1)
    {
        for(Unit *u : units_one)
        {
            if(u->is_alive() && !u->has_interacted())
            {
                turn_complete = false;
            }
        }
    }
    else
    {
        for(Unit *u : units_two)
        {
            if(u->is_alive() && !u->has_interacted())
            {
                turn_complete = false;
            }
        }
    }
    if(turn_complete)
    {
        handle_turn_change(p, r);
    }

    // If one of the Players has no living Units, then we're done!
    bool should_continue = false;
    for(Unit *u : units_one)
    {
        if(u->is_alive())
        {
            should_continue = true;
        }
    }
    if(!should_continue)
    {
        return false;
    }
    for(Unit *u : units_two)
    {
        if(u->is_alive())
        {
            should_continue = true;
        }
    }
    if(!should_continue)
    {
        return false;
    }
}

void PlayingState::handle_turn_change(Player *p, EventRequest *r)
{
    if(player_turn == 1)
    {
        player_turn = 2;
    }
    else
    {
        player_turn = 1;
    }
    notify_turn_change(r);
}

void PlayingState::handle_unit_interact(Player *p, EventRequest *r)
{
    // TODO allow targetId to be -1 to signify the Unit is doing nothing
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

void PlayingState::handle_unit_move(Player *p, EventRequest *r)
{
    // Verify that the Unit has not moved yet.
    if(unit->has_moved())
    {
        notify_invalid_request(p->get_connection(), r);
        return;
    }

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

void PlayingState::notify_turn_change(EventRequest *r)
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
    if(r != NULL)
    {
        notify["message_id"] = (*r)["message_id"];
    }
    notify["player_turn"] = player_turn;

    // Send to all connected players.
    send_all_players(notify);
}

void PlayingState::notify_unit_interact(EventRequest *r, Unit *first, Unit *second)
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

void PlayingState::notify_unit_move(EventRequest *r, Unit *target)
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

bool PlayingState::tile_reachable(int distance, int x, int y, int to_x, int to_y)
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
