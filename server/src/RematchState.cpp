#include "GenericResponses.hpp"
#include "RematchState.hpp"

RematchState::RematchState(LogWriter *log, int game_id, Player *player_one, Player *player_two)
    : GameState(log, game_id, player_one, player_two)
{
    player_one_accepted = false;
    player_two_accepted = false;
}

void RematchState::handle_request(Player *p, EventRequest *r)
{
    string type = (*r)["type"].asString();
    if(type.compare("RematchRequest") == 0)
    {
        // Take note of their agreement.
        if(p == player_one)
        {
            player_one_accepted = true;
        }
        if(p == player_two)
        {
            player_two_accepted = true;
        }

        // Send everyone a notification.
        Event notify;
        notify["type"] = string("RematchRequest");
        notify["game_id"] = game_id;
        notify["player_id"] = p->get_player_id();
        notify["request_id"] = (*r)["request_id"];
        send_all_players(notify);
    }
    else
    {
        notify_illegal_request(p->get_connection(), r);
    }
}

bool RematchState::tick(double time)
{
    // If both Players have agreed to a rematch, we're done.
    if(player_one_accepted && player_two_accepted)
    {
        return false;
    }

    // Otherwise we'll keep waiting.
    return true;
}
