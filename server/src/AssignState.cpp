#include "AssignState.hpp"
#include "GenericResponses.hpp"

AssignState::AssignState(int _game_id) : GameState(_game_id, NULL, NULL)
{
    state_name = ASSIGN;
}

void AssignState::handle_request(Player *p, EventRequest *r)
{
    string type = (*r)["type"].asString();
    if(type.compare("AssignGameRequest") == 0)
    {
        handle_assign_game(p, r);
    }
    else
    {
        notify_invalid_request(p->get_connection(), r);
    }
}

bool AssignState::tick(double time)
{
    // If we have both our players, we're good!
    if(player_one != NULL && player_two != NULL)
    {
        return false;
    }

    // Otherwise, keep going.
    return true;
}

void AssignState::handle_assign_game(Player *p, EventRequest *r)
{
    // Make sure we have room for the Player.
    if(player_one != NULL && player_two != NULL)
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

void AssignState::notify_assign_game(EventRequest *r)
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

