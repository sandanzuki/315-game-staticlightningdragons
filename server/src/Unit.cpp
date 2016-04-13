#include "Unit.hpp"

UnitType string_to_unit_type(string st)
{
    if(st.compare("FIGHTER") == 0)
    {
        return FIGHTER;
    }
    if(st.compare("ARCHER") == 0)
    {
        return ARCHER;
    }
    if(st.compare("MAGE") == 0)
    {
        return MAGE;
    }
    if(st.compare("HEALER") == 0)
    {
        return HEALER;
    }
    return INVALID;
}

Unit::Unit(int _unit_id, UnitType _type, int _player_id)
{
    unit_id = _unit_id;
    type = _type;
    player_id = _player_id;
    remaining_health = 100;
    max_health = 100;
    x = 0;
    y = 0;

    // Set the move_distance based on type.
    switch(type)
    {
        case FIGHTER:
            move_distance = 4;
            break;
        case MAGE:
            move_distance = 5;
            break;
        case ARCHER:
        case HEALER:
            move_distance = 6;
            break;
    }
}

bool Unit::interact(Unit *target)
{
    // Verify second is within range of first.
    if(is_within_range(target))
    {
        return false;
    }

    // If this Unit is a healer, calculate heals. First verify target is friendly.
    if(type == HEALER)
    {
        if(player_id != target->get_player_id())
        {
            return false;
        }
        target->apply_heal();
        return true;
    }

    // If we're not healing, verify the unit we're attacking isn't friendly.
    if(player_id == target->get_player_id())
    {
        return false;
    }

    // Let's see if it hits. There's a 25% chance of missing.
    if(rand() % 4 == 0)
    {
        // Even though we aren't applying damage, this was still a valid outcome.
        return true;
    }

    // Time to attack the target!
    target->apply_damage(this, false);

    // There's also a chance that the defender can counterattack.
    if(target->is_within_range(this))
    {
        apply_damage(this, true);
    }

    // If we've gotten here, everything was successful!
    return true;
}

void Unit::apply_damage(Unit *attacker, bool counter)
{
    // Initially determine the damage dealt.
    int base_dmg = rand() % 10 + 16;

    // Fighters take less damage, so factor this in.
    if(type == FIGHTER)
    {
        base_dmg *= 0.75;
    }

    // If this is a counter attack, cut the damage in half.
    if(counter)
    {
        base_dmg *= 0.5;
    }

    // Add in bonus if this was a "super-effective" attack.
    int bonus = rand() % 10 + 1;
    switch(type)
    {
        case FIGHTER:
            if(attacker->get_type() == MAGE)
            {
                base_dmg += bonus;
            }
            break;
        case ARCHER:
            if(attacker->get_type() == FIGHTER)
            {
                base_dmg += bonus;
            }
            break;
        case MAGE:
            if(attacker->get_type() == ARCHER)
            {
                base_dmg += bonus;
            }
            break;
    }
    
    // Actually apply this damage to the unit.
    remaining_health -= base_dmg;
    if(remaining_health < 0)
    {
        remaining_health = 0;
    }
}

void Unit::apply_heal()
{
    int amount = rand() % 20 + 1;
    if(amount + remaining_health < max_health)
    {
        remaining_health += amount;
        return;
    }
    remaining_health = max_health;
}

bool Unit::is_within_range(Unit *target)
{
    switch(type)
    {
        case FIGHTER:
            if(abs(get_x() - target->get_x()) + abs(get_y() - target->get_y()) == 1)
            {
                return true;
            }
            break;
        case ARCHER:
            if(abs(get_x() - target->get_x()) + abs(get_y() - target->get_y()) == 2)
            {
                return true;
            }
            break;
        case MAGE:
        case HEALER:
            if(abs(get_x() - target->get_x()) <= 1 && abs(get_y() - target->get_y()) <= 1)
            {
                return true;
            }
            break;
    }
    return false;
}
