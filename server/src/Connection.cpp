#include "Connection.hpp"

#include <iostream>

Connection::Connection(int _playerId, lws *_socket_info)
{
    playerId = _playerId;
    socket_info = _socket_info;
}

Connection::~Connection()
{
    for(string *s = pop_outgoing_message(); s != NULL; s = pop_outgoing_message())
    {
        delete s;
    }
}

void Connection::submit_outgoing_event(Event &event)
{
    string *s = new string(event.toStyledString());
    send_mutex.lock();
    send_queue.push(s);
    if(socket_info != NULL)
    {
        lws_callback_on_writable(socket_info);
    }
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
