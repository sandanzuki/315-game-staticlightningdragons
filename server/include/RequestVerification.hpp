#ifndef REQUEST_VERIFICATION_H
#define REQUEST_VERIFICATION_H

#include "Event.hpp"

// These functions are meant to verify that these requests are
// structured correctly. For example, each of these functions
// would return FALSE if an event were missing an appropriate
// field. No gameplay logic is here. See GameState.hpp for that.

bool verify_general_request(EventRequest *r);
bool verify_unit_interact(EventRequest *r);
bool verify_unit_move(EventRequest *r);
bool verify_unit_selection(EventRequest *r);

#endif
