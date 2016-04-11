#ifndef UNIT_H
#define UNIT_H

#include <cstdlib>
#include <vector>
#include <string>
#include <utility>
#include "Effect.hpp"

using namespace std;

enum UnitType
{
    FIGHTER,
    ARCHER,
    MAGE,
    HEALER
};

class Unit
{
    public:
        // Constructor
        Unit(int _unit_id, UnitType _type, int _player_id);

        // Getters
        int get_unit_id() const { return unit_id; }
        UnitType get_type() const { return type; }
        int get_player_id() const { return player_id; }
        int get_remaining_health() const { return remaining_health; }
        int get_max_health() { return max_health; }
        int get_x() { return x; }
        int get_y() { return y; }

        // Setters
        void set_remaining_health(int _health) { remaining_health = _health; }
        void set_position(int _x, int _y) {x = _x; y = _y; }

        // Hit/Damage/Heal Calculations
        pair<int, int> calculate_hit(Unit _attacker);
        int calculate_damage(Unit _attacker, bool _counter);
        int calculate_heal();
        bool is_within_range(Unit *target);
        
    private:
        // Unit Indentification Information
        int unit_id;
        UnitType type;
        int player_id;

        // Unit Gameplay Information
        int remaining_health;
        int max_health;
        int x;
        int y;
};

#endif
