#pragma once

#include <fstream>
#include <mutex>

namespace rqs
{
    class LogWriter
    {
    private:

        std::ofstream mLogfile;
        std::mutex mMutex;

    public:

        LogWriter();

        ~LogWriter();

        void write(std::string text);
    };
};

