#ifndef EFFECT_H
#define EFFECT_H

#include <list>

using namespace std;

class Effect {
    public:
        Effect();
        Effect(double _dmg_coeff);
        ~Effect();
        double get_damage_coefficient() { return damage_coefficient; }
    
    private:
        double damage_coefficient; 	// the coefficient affecting damage.
        
};

#endif