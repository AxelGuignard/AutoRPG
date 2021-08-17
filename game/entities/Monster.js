import {Entity} from "../Entity.js";

export class Monster extends Entity
{
    constructor(cell, vitality, strength, defense, agility, intelligence, baseAggro, sprites)
    {
        super(cell, vitality, strength, defense, agility, intelligence, baseAggro, sprites);

    }

}