#ifndef UNITFACTORY_H
#define UNITFACTORY_H

#include "unit.h"

class UnitFactory {
    public:
        UnitFactory();
        ~UnitFactory();
        Unit* build_fighter(int _player_id);	// Create a Fighter Unit.
        Unit* build_archer(int _player_id);	// Create an Archer Unit.
        Unit* build_mage(int _player_id);		// Create a Mage Unit.
        Unit* build_healer(int _player_id);	// Create a Healer Unit.
};

#endif