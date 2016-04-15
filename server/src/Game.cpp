#include "Game.hpp"

#include "AssignState.hpp"
#include "GenericResponses.hpp"
#include "PlayingState.hpp"
#include "RequestVerification.hpp"
#include "SelectionState.hpp"

Game::Game(int _game_id, MapInfo *_map) : GameState(_game_id, NULL, NULL)
{
    map = _map;
    current_state = new AssignState(game_id);
}

bool Game::tick(double time_in_seconds)
{
    // If the current_state is NULL, we're done!
    if(current_state == NULL)
    {
        return false;
    }

    // Tick things and update appropriately.
    if(!current_state->tick(time_in_seconds))
    {
        switch(current_state->get_name())
        {
            case ASSIGN:
                {
                    AssignState *as = (AssignState*) current_state;
                    player_one = as->get_player_one();
                    player_two = as->get_player_two();
                    current_state = new SelectionState(game_id, player_one, player_two);
                    delete as;
                }
                break;
            case SELECTION:
                {
                    SelectionState *ss = (SelectionState*) current_state;
                    current_state = new PlayingState(game_id, player_one, player_two,
                            ss->get_player_one_units(), ss->get_player_two_units(), map);
                    delete ss;
                }
                break;
            case PLAYING:
                {
                    delete current_state;
                    current_state = NULL;
                }
                break;
        }
    }

    // Otherwise, just keep going!
    return true;
}

void Game::handle_request(Player *p, EventRequest *r)
{
    // Assuming we still have a valid GameState, try this!
    if(current_state != NULL)
    {
        string type = (*r)["type"].asString();
        if(type.compare("PlayerQuitRequest") == 0)
        {
            // TODO - actually handle this
        }
        else
        {
            current_state->handle_request(p, r);
        }
    }

    // After everything is done, delete the EventRequest.
    delete r;
}

bool Game::needs_player()
{
    return player_one == NULL || player_two == NULL;
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
