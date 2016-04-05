#ifndef CONNECTION_H
#define CONNECTION_H

#include "Event.hpp"

#include <mutex>
#include <queue>
#include <string>

using namespace std;

class Connection
{
    public:
        Connection(int _playerId);
        ~Connection();

        void submit_incoming_message(string &message);
        void submit_outgoing_event(Event &event);

        EventRequest *pop_incoming_request();   // Grab a pointer to that request. Don't forget to delete it. Null on none.
        string *pop_outgoing_message();         // Grab a pointer to the string. Don't forget to delete it. Null on none.

    private:
        int playerId;   // ID of the Player this Connection is associated with

        queue<EventRequest*> recv_queue;     // queue of Events that have been received, pre-processed
        queue<string*> send_queue;           // queue of outgoing events, already as strings

        mutex recv_mutex;   // mutex surrounding recv_queue
        mutex send_mutex;   // mutex locking send_queue
};

#endif
