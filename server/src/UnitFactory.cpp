#include "UnitFactory.hpp"

UnitFactory::UnitFactory() {
    
}

UnitFactory::~UnitFactory() {
    
}

Unit*  UnitFactory::build_fighter(int _player_id) {
    return new Unit(0, _player_id, "fighter");
}

Unit*  UnitFactory::build_archer(int _player_id) {
    return new Unit(1, _player_id, "archer");
}

Unit*  UnitFactory::build_mage(int _player_id) {
    return new Unit(2, _player_id, "mage");
}

Unit*  UnitFactory::build_healer(int _player_id) {
    return new Unit(3, _player_id, "healer");
}
