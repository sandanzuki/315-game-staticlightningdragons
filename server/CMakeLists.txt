cmake_minimum_required(VERSION 3.1)
project(rqserver)

set(CMAKE_MODULE_PATH "." ${CMAKE_MODULE_PATH})
#find_package(SFML COMPONENTS audio graphics system window)

include_directories(./include)

set(RQSERVER_SOURCES
    ./src/Connection.cpp
    ./src/Effect.cpp
    ./src/GameState.cpp
    ./src/LogWriter.cpp
    ./src/main.cpp
    ./src/NetworkManager.cpp
    ./src/Player.cpp
    ./src/Unit.cpp
    ./src/UnitFactory.cpp

    ./src/jsoncpp.cpp
)

add_executable(rqserver ${RQSERVER_SOURCES})
target_link_libraries(rqserver pthread)
target_link_libraries(rqserver websockets)
target_compile_features(rqserver PRIVATE cxx_range_for)
