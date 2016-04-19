#include "GenericResponses.hpp"

void notify_illegal_request(Connection *c, EventRequest *r)
{
    Event illegal_event;
    illegal_event["type"] = string("IllegalEvent");
    illegal_event["request_id"] = (*r)["request_id"];
    c->submit_outgoing_event(illegal_event);
}

void notify_invalid_request(Connection *c, EventRequest *r)
{
    Event invalid_event;
    invalid_event["type"] = string("InvalidEvent");
    if(r != NULL && r->isMember("request_id"))
    {
        invalid_event["request_id"] = (*r)["request_id"];
    }
    c->submit_outgoing_event(invalid_event);
}
