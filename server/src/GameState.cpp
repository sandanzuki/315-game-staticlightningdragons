#include "GameState.hpp"

GameState::GameState(int _game_id, string _map_file) {
    game_id = _game_id;
    map_file = _map_file;
    map_width = 15;
    map_height = 10;
    player_one == NULL;
    player_two == NULL;
}

GameState::~GameState() {

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
