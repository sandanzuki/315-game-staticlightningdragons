#ifndef CONNECTION_H
#define CONNECTION_H

#include "Event.hpp"

#include <libwebsockets.h>
#include <mutex>
#include <queue>
#include <string>

using namespace std;

class Connection
{
    public:
        Connection(int _playerId, lws *_socket_info = NULL);
        ~Connection();

        void submit_outgoing_event(Event &event);
        string *pop_outgoing_message();         // Grab a pointer to the string. Don't forget to delete it. Null on none.

        int get_id() { return playerId; }

    private:
        int playerId;               // ID of the Player this Connection is associated with
        queue<string*> send_queue;  // queue of outgoing events, already as strings
        mutex send_mutex;           // mutex locking send_queue
        lws *socket_info;           // the socket for LWS
};

#endif
