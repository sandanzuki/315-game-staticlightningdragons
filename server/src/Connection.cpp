#include "Connection.hpp"

Connection::Connection(int _playerId)
{
    playerId = _playerId;
}

Connection::~Connection()
{
    send_mutex.lock();
    for(string *s = pop_outgoing_message(); s != NULL; s = pop_outgoing_message())
    {
        delete s;
    }
    send_mutex.unlock();
}

void Connection::submit_outgoing_event(Event &event)
{
    string *s = new string(event.asString());
    send_mutex.lock();
    send_queue.push(s);
    send_mutex.unlock();
}

string *Connection::pop_outgoing_message()
{
    send_mutex.lock();
    if(send_queue.empty())
    {
        send_mutex.unlock();
        return NULL;
    }
    string *r = send_queue.front();
    send_queue.pop();
    send_mutex.unlock();
    return r;
}
