#include "RequestVerification.hpp"
#include "SelectionState.hpp"

void SelectionState::handle_request(Player *p, EventRequest *r)
{
    // There's really only one thing we're worried about...
    string type = (*r)["type"].asString();
    if(type.compare("UnitMoveRequest") == 0)
    {
        handle_unit_selection(p, r);
    }
    else
    {
        notify_invalid_request(p->get_connection(), r);
    }
}

bool SelectionState::tick(double tick)
{
    // If both players have selected units, we're done!
    if(!units_one.empty() && !units_two.empty())
    {
        return false;
    }
    
    // Otherwise, keep going!
    return true;
}

void SelectionState::handle_unit_selection(Player *p, EventRequest *r)
{
    // Verify that the Player hasn't already submitted Units.
    if((p == player_one && !units_one.empty()) || (p == player_two && !units_two.empty()))
    {
        notify_illegal_request(p->get_connection(), r);
        return;
    }

    // Verify that the request has all necessary fields.
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
        if(p == player_one)
        {
            units_one.push_back(new Unit(units_one.size(), types[i], p->get_player_id()));
        }
        else
        {
            units_two.push_back(new Unit(units_two.size(), types[i], p->get_player_id()));
        }
    }

    // And notify the Player that we're all good.
    notify_select_units(p, r);
}

void SelectionState::notify_select_units(Player *p, EventRequest *r)
{
    Event notify;
    notify["type"] = string("SelectUnitsEvent");
    notify["game_id"] = game_id;
    notify["request_id"] = (*r)["request_id"];
    notify["player_id"] = p->get_player_id();
    send_all_players(notify);
}
