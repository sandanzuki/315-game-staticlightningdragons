cmake_minimum_required(VERSION 3.1)
project(rqserver)

set(CMAKE_MODULE_PATH "." ${CMAKE_MODULE_PATH})
#find_package(SFML COMPONENTS audio graphics system window)

include_directories(./include)

set(RQSERVER_SOURCES
    ./src/LogWriter.cpp
    ./src/jsoncpp.cpp
    ./src/main.cpp
    ./src/network.cpp
)

add_executable(rqserver ${RQSERVER_SOURCES})
target_link_libraries(rqserver websockets)
target_compile_features(rqserver PRIVATE cxx_range_for)
#target_link_libraries(soltora ${SFML_LIBRARIES})

