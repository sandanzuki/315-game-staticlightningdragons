#include "unit.h"

Unit::Unit() {
    
}

Unit::Unit(int _unit_id, int _player_id, string _name) {
    unit_id = _unit_id;
    player_id = _player_id;
    name = _name;
    remaining_health = 100;
    max_health = 100;
    //effects = ;
}

Unit::Unit(int _unit_id, int _player_id, string _name, int _remaining_health, list<Effect> _effects) {
    unit_id = _unit_id;
    player_id = _player_id;
    name = _name;
    remaining_health = _remaining_health;
    max_health = 100;
    effects = _effects;
}

Unit::Unit(const Unit &obj) {
    unit_id = obj.get_unit_id();
    player_id = obj.get_player_id();
    name = obj.get_name();
    remaining_health = obj.get_remaining_health();
    max_health = 100;
    effects = obj.get_effects();
}

Unit::~Unit() {
    
}