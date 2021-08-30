import {Entity} from "../Entity.js";

export class Monster extends Entity
{
    constructor(cell, vitality, strength, defense, agility, intelligence, baseAggro, sprites)
    {
        super(cell, vitality, strength, defense, agility, intelligence, baseAggro, sprites);
    }

    attack()
    {
        if (this.doing.step === 2)
        {
            if (this.doing.target.checkHit())
                this.doing.target.takeDamage(this.strength * 10);
            this.doing.end = true;
        }
    }

    idle()
    {
        if (this.doing.step === 2)
        {
            this.gainExperience(1);
            this.doing.end = true;
        }
    }
}