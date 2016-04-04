#include "LogWriter.hpp"

#include <iostream>

LogWriter::LogWriter()
{
    mLogfile.open("./logfile.txt", std::ios::trunc);
}

LogWriter::~LogWriter()
{
    if(mLogfile.is_open())
    {
        mLogfile.close();
    }
}

void LogWriter::write(std::string text)
{
    mMutex.lock();
    if(mLogfile.is_open())
    {
        mLogfile << text;
    }
    std::cout << text << std::endl;
    mMutex.unlock();
}
