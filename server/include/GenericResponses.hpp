#ifndef GENERIC_RESPONSES_H
#define GENERIC_RESPONSES_H

#include "Event.hpp"
#include "Player.hpp"

void notify_illegal_request(Player *p, EventRequest *r);
void notify_invalid_request(Player *p, EventRequest *r);

#endif
