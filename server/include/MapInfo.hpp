#ifndef MAP_INFO_HPP
#define MAP_INFO_HPP

#include "LogWriter.hpp"

#include <string>

using namespace std;

class MapInfo
{
    public:
        MapInfo(LogWriter *log, string mapfile);
        ~MapInfo();

        int get_height() { return height; }
        int get_width() { return width; }
        bool is_blocked(int x, int y) { return blocked_tiles[x][y]; }

    private:
        bool **blocked_tiles;
        int height;
        int width;
};

#endif
