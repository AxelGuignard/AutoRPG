import {Entity} from "../Entity.js";
import {Pegu} from "../classes/Pegu.js";

export class Hero extends Entity
{
    constructor(cell)
    {
        super(cell, 1, 1, 1, 1, 1, 1, null);
        this.class = new Pegu();
        this.raiseStats(3);
    }

    move()
    {

    }

    resolveCombatAction()
    {
        if (typeof this.class.resolveCombatAction === "function")
            this.class.resolveCombatAction(this);
        else
            super.resolveCombatAction();
    }

    /**
     * Heroes attack depends on their class
     * @param {Number} step
     * @param {Entity} target
     */
    attack(step, target)
    {
        if (step === 1)
        {
            if (typeof this.class.attack === "function")
                this.class.attack(target, this);
            else
                target.takeDamage((this.strength + this.class.strengthModifier) * 10);
        }
        else if (step === 2)
        {
            this.doing.end = true;
        }
    }

    /**
     * Heroes can evade more efficiently depending of their class
     */
    checkHit()
    {
        if (typeof this.class.checkHit === "function")
            this.class.checkHit(this);
        else
        {
            let random = Math.random() * 99 + 1;
            return random > this.agility + this.class.agilityModifier;
        }
    }

    /**
     * Heroes can reduce damages based on their class
     * @param damage
     */
    takeDamage(damage)
    {
        if (typeof this.class.takeDamage === "function")
            this.class.takeDamage(damage, this);
        else
            this.currentHealth -= Math.round(damage * (1 - Math.min((this.defense + this.class.defenseModifier) * 0.05, 0.9)));
    }

    getSprite(sprite)
    {
        return this.class.sprites[sprite];
    }

    gainLevel()
    {
        super.gainLevel();
        if (this.level === 3 || this.level === 10)
            this.chooseClass();
    }

    chooseClass()
    {
        // TODO
    }
}