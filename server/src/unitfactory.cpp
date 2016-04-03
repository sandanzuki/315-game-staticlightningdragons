#include "unitfactory.h"

UnitFactory::UnitFactory() {
    
}

UnitFactory::~UnitFactory() {
    
}

Unit*  UnitFactory::build_fighter(int _player_id) {
    return Unit(unit_id, _player_id, "fighter")
}

Unit*  UnitFactory::build_archer(int _player_id) {
    return Unit(unit_id, _player_id, "archer")
}

Unit*  UnitFactory::build_mage(int _player_id) {
    return Unit(unit_id, _player_id, "mage")
}

Unit*  UnitFactory::build_healer(int _player_id) {
    return Unit(unit_id, _player_id, "healer")
}