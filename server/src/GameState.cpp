#include "GameState.hpp"

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
    if(current_gamestate == State::GAME_OVER)
    {
        return false;
    }
    return true;
}

void GameState::handle_request(EventRequest *r)
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
