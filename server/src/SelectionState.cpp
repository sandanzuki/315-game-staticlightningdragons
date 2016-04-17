#include "RequestVerification.hpp"
#include "SelectionState.hpp"

void SelectionState::handle_request(Player *p, EventRequest *r)
{
    // There's really only one thing we're worried about...
    string type = (*r)["type"].asString();
    if(type.compare("UnitSelectionRequest") == 0)
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
        // Don't forget to tell the Players which units are which.
        notify_all_units();
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

void SelectionState::notify_all_units()
{
    // Build the Json::Value with the first player's units.
    Json::Value player_one;
    for(int i = 0; i < units_one.size(); ++i)
    {
        Json::Value unit;
        unit["type"] = units_one[i]->get_type_string();
        unit["hp"] = units_one[i]->get_max_health();
        unit["x"] = units_one[i]->get_x();
        unit["y"] = units_one[i]->get_y();
        unit["id"] = i;
        unit["speed"] = units_one[i]->get_move_distance();
        player_one[i + 1] = unit;
    }

    // Now the second!
    Json::Value player_two;
    for(int i = 0; i < units_two.size(); ++i)
    {
        Json::Value unit;
        unit["type"] = units_two[i]->get_type_string();
        unit["hp"] = units_two[i]->get_max_health();
        unit["x"] = units_two[i]->get_x();
        unit["y"] = units_two[i]->get_y();
        unit["id"] = i;
        unit["speed"] = units_two[i]->get_move_distance();
        player_two[i + 1] = unit;
    }

    // Now create the Event and add this information.
    Event notify;
    notify["type"] = string("AllUnitsSelectedEvent");
    notify["game_id"] = game_id;
    notify["player_one"] = player_one;
    notify["player_two"] = player_two;
    send_all_players(notify);
}
