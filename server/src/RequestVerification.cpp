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

bool verify_rename_request(EventRequest *r)
{
    // Must have a string name.
    if(!r->isMember("name"))
    {
        return false;
    }

    // Otherwise, we're good!
    return true;
}

bool verify_unit_interact(EventRequest *r)
{
    // Must have a unitId
    if(!r->isMember("unit_id") || !(*r)["unit_id"].isInt())
    {
        return false;
    }

    // Must have a targetId (that is also a valid unitId)
    if(!r->isMember("target_id") || !(*r)["target_id"].isInt())
    {
        return false;
    }

    // Otherwise, we're good!
    return true;
}

bool verify_unit_move(EventRequest *r)
{
    // Must have a unitId
    if(!r->isMember("unit_id") || !(*r)["unit_id"].isInt())
    {
        return false;
    }

    // Must specify a tileX
    if(!r->isMember("x") || !(*r)["x"].isInt())
    {
        return false;
    }

    // Must specify a tileY
    if(!r->isMember("y") || !(*r)["y"].isInt())
    {
        return false;
    }

    // Otherwise we're good!
    return true;
}

bool verify_unit_selection(EventRequest *r)
{
    // Must specify a type for units one-five
    if(!r->isMember("first") || !(*r)["first"].isString())
    {
        return false;
    }
    if(!r->isMember("second") || !(*r)["second"].isString())
    {
        return false;
    }
    if(!r->isMember("third") || !(*r)["third"].isString())
    {
        return false;
    }
    if(!r->isMember("fourth") || !(*r)["fourth"].isString())
    {
        return false;
    }
    if(!r->isMember("fifth") || !(*r)["fifth"].isString())
    {
        return false;
    }

    // Otherwise we're good!
    return true;
}
