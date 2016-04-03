#include <libwebsockets.h>
#include <iostream>

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
                std::cerr << "Error writing response, booting player and closing connection." << std::endl;
                return -1;
            }
            break;
    }
    return 0;
}

int network_thread()
{
    // Define the protocols first.
    struct lws_protocols protocols[] =
    {
        {
            "http-only",
            callback_http,
            0,
            0,
        },
        { NULL, NULL, 0, 0}
    };

    // LWS has a context. But before it has a context, it has context info.
    struct lws_context_creation_info info;
    memset(&info, 0, sizeof info);
    info.port = 41337;
    info.protocols = protocols;

    // No context? Make context!
    struct lws_context *context = lws_create_context(&info);

    // Always provide service.
    while(true)
    {
        lws_service(context, 50);
    }

    // Lose the context.
    lws_context_destroy(context);

    return 0;
}
