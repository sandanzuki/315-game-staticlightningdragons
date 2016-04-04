#include "LogWriter.hpp"

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

