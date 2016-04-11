#ifndef GENERIC_RESPONSES_H
#define GENERIC_RESPONSES_H

#include "Event.hpp"
#include "Player.hpp"

void notify_illegal_request(Connection *c, EventRequest *r);
void notify_invalid_request(Connection *c, EventRequest *r);

#endif
