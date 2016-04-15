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
        notify_state_change();
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

        // Real talk, if either Player quits, it's time to die.
        if(type.compare("PlayerQuitRequest") == 0)
        {
            // First remove the requesting player from the Game.
            if(player_one == p)
            {
                player_one = NULL;
            }
            else if(player_two == p)
            {
                player_two == NULL;
            }

            // If we're in SELECTION state, we have to delete the Units first.
            if(current_state->get_name() == SELECTION)
            {
                SelectionState *ss = (SelectionState*) current_state;
                for(Unit *u : ss->get_player_one_units())
                {
                    delete u;
                }
                for(Unit *u : ss->get_player_two_units())
                {
                    delete u;
                }
            }
            
            // Now delete the current_state and notify the remaining Player.
            delete current_state;
            current_state = NULL;
            notify_state_change();
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

void Game::notify_state_change()
{
    // Determine the state string based on state.
    string state = "";
    if(current_state == NULL)
    {
        state = "GAME_OVER";
    }
    else
    {
        switch(current_state->get_name())
        {
            case ASSIGN:
                state = "ASSIGN";
                break;
            case SELECTION:
                state = "SELECTION";
                break;
            case PLAYING:
                state = "PLAYING";
                break;
        }
    }

    // Build the Event
    Event notify;
    notify["type"] = string("StateChangeEvent");
    notify["game_id"] = game_id;
    notify["state"] = state;

    // Send to all connected players.
    send_all_players(notify);
}
