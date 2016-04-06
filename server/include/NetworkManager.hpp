#ifndef NETWORK_H
#define NETWORK_H

#include "Connection.hpp"

#include "json/json.h"

#include <libwebsockets.h>
#include <map>
#include <mutex>
#include <queue>

class NetworkManager
{
    public:
        NetworkManager();
        ~NetworkManager();

        void submit_incoming_message(int connection_id, std::string &message);
        EventRequest *pop_incoming_request();

        // Manage connections.
        int add_connection();
        Connection *get_connection(int id);
        void kill_connection(int id);

        // Pop notifications of new Connections.
        Connection *pop_new_connection();

    private:
        int highest_connection_id;
        map<int, Connection*> connections;
        queue<Connection*> new_connections;
        queue<EventRequest*> recv_queue;
        mutex nm_mutex;
};

void init_networking_thread(NetworkManager *nm, LogWriter *log);
void shutdown_networking_thread();

#endif
