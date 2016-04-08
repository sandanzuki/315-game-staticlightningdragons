#ifndef UNIT_H
#define UNIT_H

#include <cstdlib>
#include <vector>
#include <string>
#include <utility>
#include "Effect.hpp"

using namespace std;

class Unit {
    public:
        Unit();
        Unit(int _unit_id, int _player_id, string _name);
        Unit(int _unit_id, int _player_id, string _name, int _remaining_health, vector<Effect> _effects);
        Unit(const Unit &obj);
        ~Unit();
        int get_unit_id() const { return unit_id; }
        int get_player_id() const { return player_id; }
        int get_remaining_health() const { return remaining_health; }
        int get_max_health() { return max_health; }
        vector<Effect> get_effects() const { return effects; }
        string get_name() const { return name; }
        void set_remaining_health(int _health);
        void add_effects(vector<Effect> _add_effect);
        void remove_effects(vector<Effect> _remove_effect);
        pair<int, int> calculate_hit(Unit _attacker);
        int calculate_damage(Unit _attacker, bool _counter);
        int calculate_heal();
        
    private:
        int unit_id;
        int player_id;
        string name;
        int remaining_health;
        int max_health;
        vector<Effect> effects;
};

#endif
