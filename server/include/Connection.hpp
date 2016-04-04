#ifndef CONNECTION_H
#define CONNECTION_H

#include <queue>

#include "json/json.h"

typedef Json::Value Event;

using namespace std;

class Connection {
    public:
        Connection() {}
        ~Connection() {}
        void read_callback();	// called by libwebsockets when data is received.
        void write_callback();	// called by libwebsockets when we can write again.
    
    private:
        queue<Event> send_queue;	// queue of outgoing Events.
};

#endif
