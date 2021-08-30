import {Class} from "../Class.js";
import {images} from "../main.js";

export class Rogue extends Class
{
    static mainStats = ["agility", "strength"];

    constructor() {
        let sprites = {
            walk1: images["RogueWalking1"],
            walk2: images["RogueWalking2"],
            attack1: images["RogueAttack1"],
            attack2: images["RogueAttack2"],
            sneakAttack1: images["RogueWalking1"],
            sneakAttack2: images["RogueWalking2"]
        };
        super(0, 1, 0, 1, 0, 0, sprites);
    }

    resolveCombatAction(hero)
    {
        let random = Math.random() * 99 + 1;
        if (random <= Math.round(hero.getAgility() * 1.5))
            hero.doing.action = "sneakAttack";
        else
            hero.doing.action = "attack";
        hero.doing.step = 1;
        hero.doing.target = hero.chooseTarget();
        hero.doing.end = false;
    }

    getMainStats()
    {
        return Rogue.mainStats;
    }

    sneakAttack(hero)
    {
        if (hero.doing.step === 1)
        {
            if (hero.doing.target.checkHit())
                hero.doing.target.takeDamage(hero.getStrength() * 15);
        }
        else if (hero.doing.step === 2)
        {
            hero.doing.end = true;
        }
    }
}