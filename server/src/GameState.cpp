#include "GameState.hpp"

GameState::GameState(LogWriter *_log, int _game_id, Player *_player_one, Player *_player_two)
{
    log = _log;
    game_id = _game_id;
    player_one = _player_one;
    player_two = _player_two;
    state_name = NONE;
}

void GameState::send_all_players(Event &e)
{
    log->write("[ASSIGN] DEBUG: Sending Event to all Players.");
    if(player_one != NULL)
    {
        log->write("[ASSIGN] DEBUG: Sending Event to Player 1.");
        player_one->get_connection()->submit_outgoing_event(e);
    }
    if(player_two != NULL)
    {
        log->write("[ASSIGN] DEBUG: Sending Event to Player 2.");
        player_two->get_connection()->submit_outgoing_event(e);
    }
}
