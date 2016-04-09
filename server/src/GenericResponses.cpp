#include "GenericResponses.hpp"

void notify_illegal_request(Player *p, EventRequest *r)
{
    Event illegal_event;
    illegal_event["type"] = string("IllegalEvent");
    illegal_event["message_id"] = (*r)["message_id"];
    p->get_connection()->submit_outgoing_event(illegal_event);
    delete r;
}

void notify_invalid_request(Player *p, EventRequest *r)
{
    Event invalid_event;
    invalid_event["type"] = string("InvalidEvent");
    invalid_event["message_id"] = (*r)["message_id"];
    p->get_connection()->submit_outgoing_event(invalid_event);
    delete r;
}

