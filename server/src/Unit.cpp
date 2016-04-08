#include "Unit.hpp"

Unit::Unit() {
    
}

Unit::Unit(int _unit_id, int _player_id, string _name) {
    unit_id = _unit_id;
    player_id = _player_id;
    name = _name;
    remaining_health = 100;
    max_health = 100;
}

Unit::Unit(int _unit_id, int _player_id, string _name, int _remaining_health, vector<Effect> _effects) {
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

void Unit::set_remaining_health(int _health) {
    remaining_health = _health;
}

void Unit::add_effects(vector<Effect> add_effect) {
    
}

void Unit::remove_effects(vector<Effect> remove_effect) {
    
}

pair<int, int> Unit::calculate_hit(Unit _attacker) {
    int def_before = this->get_remaining_health();
    int atk_before = _attacker.get_remaining_health();
    int damage = calculate_damage(_attacker, false);
    int counter_dmg = calculate_damage(_attacker, true);
    int def_after = def_before - damage;
    int atk_after = def_before - counter_dmg;
    if(rand() % 4 == 0) return make_pair(0,0); // miss
    else {
        if (def_after <= 0) {
            this->set_remaining_health(0);
            return make_pair(def_before, 0);
        } else if (atk_after <= 0) {
            this->set_remaining_health(def_after);
            _attacker.set_remaining_health(0);
            return make_pair(damage, atk_before);
        } else {
            this->set_remaining_health(def_after);
            _attacker.set_remaining_health(atk_after);
        }
    }
    return make_pair(damage, counter_dmg);
}

int Unit::calculate_damage(Unit _attacker, bool _counter) {
    double base_dmg = rand() % 10 + 16;
    if (_counter) base_dmg *= 0.5;
    if (this->name == "fighter") {
        if (_attacker.get_name() == "fighter") base_dmg *= 0.75;
        else if (_attacker.get_name() == "archer") base_dmg += rand() % 10 + 1; //number between 1 and 10
    } else if (this->name == "archer") {
        if (_attacker.get_name() == "fighter") base_dmg += rand() % 10 + 1; //number between 1 and 10
    } else if (this->name == "mage") {
        if (_attacker.get_name() == "archer") base_dmg += rand() % 10 + 1; //number between 1 and 10
    }
    return (int)base_dmg;
}

int Unit::calculate_heal() {
    int amount = rand() % 20 + 1;
    int before_heal = this->get_remaining_health();
    int after_heal = amount + before_heal;
    int max_health = this->get_max_health();
    
    if (after_heal >= max_health) {
        this->set_remaining_health(max_health);
        return max_health - before_heal;
    } else {
        this->set_remaining_health(after_heal);
        return amount;
    }
}