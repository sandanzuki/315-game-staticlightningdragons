cmake_minimum_required(VERSION 2.6)
project(rqserver)

set(CMAKE_MODULE_PATH "." ${CMAKE_MODULE_PATH})
#find_package(SFML COMPONENTS audio graphics system window)

set(RQSERVER_SOURCES
    ./src/LogWriter.cpp
    ./src/main.cpp
)

add_executable(rqserver ${RQSERVER_SOURCES})
#target_link_libraries(soltora ${SFML_LIBRARIES})

