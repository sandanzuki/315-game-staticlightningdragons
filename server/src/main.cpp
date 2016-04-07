#include "LogWriter.hpp"
#include "NetworkManager.hpp"

#include <unistd.h>

int main(int argc, char **argv)
{
    LogWriter log;
    log.write("Hello, logs!");
    NetworkManager *nm = new NetworkManager();
    init_networking_thread(nm, &log);

    while(true)
    {
        Connection *c = nm->pop_new_connection();
        if(c != NULL)
        {
            log.write("[MAIN] INFO: A new player connected!");
            Event out;
            out["hello"] = std::string("Howdy!");
            c->submit_outgoing_event(out);
        }
        sleep(1);
    }
    shutdown_networking_thread();
    return 0;
}
