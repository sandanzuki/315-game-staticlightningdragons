#include "LogWriter.hpp"
#include "NetworkManager.hpp"

#include "json/json.h"

#include <libwebsockets.h>


// Globals - because there is no better way.
// Well, there might be, but I can't think of it.
// Because C.

LogWriter *log;

int callback_http(struct lws *wsi, enum lws_callback_reasons reason, void *user, void *in, size_t len)
{
    // Just give me a reason, just a little bit's enough...
    switch(reason)
    {
        case LWS_CALLBACK_RECEIVE:

            lws_callback_on_writable(wsi);
            break;

        case LWS_CALLBACK_SERVER_WRITEABLE:
        case LWS_CALLBACK_HTTP_WRITEABLE:

            char response[2048];
            memset(response, 0, 2048);
            strcpy(response + LWS_PRE, "Howdy! Please use the `rqs` protocol instead!");
            unsigned char response_clean[2048];
            for (int i = 0; i < 2048; ++i) {
                response_clean[i] = (unsigned char) response[i];
            }
            if(lws_write(wsi, response_clean + LWS_PRE, 46, LWS_WRITE_TEXT) == -1)
            {
                log->write("[NET] ERROR: Unable to write response, disconnecting player.");
                return -1;
            }
            break;
    }
    return 0;
}

int network_thread(LogWriter *logptr, bool &should_continue)
{
    // Make the log accessible to other functions.
    log = logptr;

    // Setup LWS.
    struct lws_context_creation_info info;
    memset(&info, 0, sizeof info);
    info.port = 41337; // a hard-coded port of magnificent importance
    struct lws_protocols protocols[] = { {"http-only", callback_http, 0, 0,}, { NULL, NULL, 0, 0} };
    info.protocols = protocols;

    // Create the LWS context and verify that there were no errors.
    struct lws_context *context = lws_create_context(&info);
    if(context == NULL)
    {
        log->write("[NET] CRITICAL: Could not create libwebsockets context.");
        return -1;
    }

    // Keep LWS ticking.
    while(should_continue)
    {
        lws_service(context, 50);
    }

    // Once we're done, destroy the context so that we may be free.
    lws_context_destroy(context);
    return 0;
}

NetworkManager::NetworkManager()
{
    highest_connection_id = 0;
}

NetworkManager::~NetworkManager()
{
    recv_queue_mutex.lock();
    for(EventRequest *r = pop_incoming_request(); r != NULL; r = pop_incoming_request())
    {
        delete r;
    }
    recv_queue_mutex.unlock();
}

void NetworkManager::submit_incoming_message(std::string &message)
{
    // TODO - figure out if this throws exceptions
    EventRequest *r = new EventRequest();
    stringstream(message) >> (*r);
    (*r)["playerId"] = playerId;
    recv_queue_mutex.lock();
    recv_queue.push(r);
    recv_queue_mutex.unlock();
}

EventRequest *NetworkManager::pop_incoming_request()
{
    recv_queue_mutex.lock();
    if(recv_queue.empty())
    {
        recv_queue_mutex.unlock();
        return NULL;
    }
    EventRequest *r = recv_queue.front();
    recv_queue.pop();
    recv_queue_mutex.unlock();
    return r;
}

int NetworkManager::add_connection()
{
    new_connections_mutex.lock();
    connections_mutex.lock();
    ++highest_connection_id;
    connections.emplace(highest_connection_id, highest_connection_id);
    new_connections.push(&connections[highest_connection_id]);
    connections_mutex.unlock();
    new_connections_mutex.unlock();
}
