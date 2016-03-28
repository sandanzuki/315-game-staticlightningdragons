#pragma once

#include <fstream>

namespace rqs
{
    class LogWriter
    {
    private:

        std::ofstream mLogfile;

    public:

        LogWriter();

        ~LogWriter();

        void write(std::string text);
    };
};

