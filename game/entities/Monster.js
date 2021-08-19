import {Entity} from "../Entity.js";

export class Monster extends Entity
{
    constructor(cell, vitality, strength, defense, agility, intelligence, baseAggro, sprites)
    {
        super(cell, vitality, strength, defense, agility, intelligence, baseAggro, sprites);
    }

    attack(step, target)
    {
        if (step === 2)
        {
            if (target.checkHit())
                target.takeDamage(this.strength * 10);
            this.doing.end = true;
        }
    }

    idle()
    {
        this.gainExperience(1);
    }
}