#include "MapInfo.hpp"

#include "json/json.h"

#include <iostream>
using namespace std;

MapInfo::MapInfo(string mapfile)
{
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

    Json::Value map_data;
    Json::Reader reader;
    bool parsingSuccessful = reader.parse(mapfile, map_data);
    if(!parsingSuccessful)
    {
        // report failure and their locations in the document to the user
        cout << "Failed to parse configuration\n" << reader.getFormattedErrorMessages();
        return;
    }    

    height = map_data["height"].asInt();
    width = map_data["width"].asInt();
    const Json::Value layers = map_data["layers"];
    Json::Value blocked_data;
    for (int index = 0; index < layers.size(); ++index)
        if(layers[index]["name"].asString().compare("blockedLayer") == 0)
        {
            blocked_data = layers[index]["data"];
            break;
        }
    for (int index = 0; index < blocked_data.size(); ++index)
    {
        int tile_data = blocked_data[index].asInt();
        if(tile_data != 0)
        {
            int x = index / width;
            int y = index - x * width;
            blocked_tiles[x][y] = true;
        }
    }
    Json::Value next_object_id = map_data["nextobjectid"];
    Json::Value orientation = map_data["orientation"];
    Json::Value render_order = map_data["renderorder"];
    Json::Value tile_height = map_data["tileheight"];
    Json::Value tile_width = map_data["tilewidth"];
    Json::Value tile_sets = map_data["tilesets"];
    Json::Value version = map_data["version"];    
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
