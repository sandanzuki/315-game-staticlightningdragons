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
    //notify["unit_x"] = x; // TODO - actually keep track of unit X position
    //notify["unit_y"] = y; // TODO - actually keep track of unit Y position

    // Send to all connected players.
    send_all_players(notify);
}
