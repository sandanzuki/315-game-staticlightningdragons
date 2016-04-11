#include "RequestVerification.hpp"

bool verify_general_request(EventRequest *r)
{
    // Must have INT request_id
    if(!r->isMember("request_id") || !(*r)["request_id"].isInt())
    {
        return false;
    }
    
    // Must have INT game_id
    if(!r->isMember("game_id") || !(*r)["game_id"].isInt())
    {
        return false;
    }
    
    // Must have STRING type.
    if(!r->isMember("type") || !(*r)["type"].isString())
    {
        return false;
    }

    // Assuming it has all of these, it's good!
    return true;
}

bool verify_unit_interact(EventRequest *r)
{

}

bool verify_unit_move(EventRequest *r)
{

}

bool verify_unit_selection(EventRequest *r)
{

}
