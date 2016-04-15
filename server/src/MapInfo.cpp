#include "MapInfo.hpp"

#include "json/json.h"

#include <fstream>
using namespace std;

MapInfo::MapInfo(LogWriter *log, string mapfile)
{
    // Load the file.
    ifstream input(mapfile.c_str());
    // Parse the JSON.
    Json::Value map_data;
    Json::Reader reader;
    bool parsingSuccessful = reader.parse(input, map_data);
    if(!parsingSuccessful)
    {
        log->write("[MAP] ERROR: Failed to parse configuration. Error below.\n");
        log->write(reader.getFormattedErrorMessages());
        log->write("");
        return;
    }    

    // Get the height and the width of the map.
    height = map_data["height"].asInt();
    width = map_data["width"].asInt();

    // Setup the blocked_tiles array.
    blocked_tiles = new bool*[width];
    for(int i = 0; i < width; ++i)
    {
        blocked_tiles[i] = new bool[height];
        for(int j = 0; j < height; ++j)
        {
            blocked_tiles[i][j] = false;
        }
    }

    // Locate the layer with the Blocked Data.
    const Json::Value layers = map_data["layers"];
    Json::Value blocked_data;
    for(int index = 0; index < layers.size(); ++index)
    {
        if(layers[index]["name"].asString().compare("blockedLayer") == 0)
        {
            blocked_data = layers[index]["data"];
            break;
        }
    }

    // Iterate through the Blocked Data and fill in blocked_tiles appropriately.
    for(int index = 0; index < blocked_data.size(); ++index)
    {
        int tile_data = blocked_data[index].asInt();
        if(tile_data != 0)
        {
            int x = index / width;
            int y = index - x * width;
            blocked_tiles[x][y] = true;
        }
    }
}

MapInfo::~MapInfo()
{
    // Delete the blocked_tiles array
    for(int i = 0; i < width; ++i)
    {
        delete blocked_tiles[i];
    }
    delete blocked_tiles;
}
