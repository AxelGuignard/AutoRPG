import {Entity} from "../Entity.js";
import {Pegu} from "../classes/Pegu.js";
import {Fighter} from "../classes/Fighter.js";
import {Wizard} from "../classes/Wizard.js";
import {Rogue} from "../classes/Rogue.js";
import {Utils} from "../Utils.js";

export class Hero extends Entity
{
    constructor(cell)
    {
        super(cell, 1, 1, 1, 1, 1, 1, null);
        this.class = new Pegu();
        this.classLevel = 0;
        this.raiseStats(3);
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
     */
    attack()
    {
        if (this.doing.step === 1)
        {
            if (typeof this.class.attack === "function")
                this.class.attack(this.doing.target, this);
            else if (this.doing.target.checkHit())
                this.doing.target.takeDamage((this.getStrength()) * 10);
        }
        else if (this.doing.step === 2)
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
            return random > this.getAgility();
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
            this.currentHealth -= Math.round(damage * (1 - Math.min((this.getDefense()) * 0.05, 0.9)));
    }

    getSprite(sprite)
    {
        return this.class.sprites[sprite];
    }

    gainLevel()
    {
        super.gainLevel();
        console.log(this.level);
        if (this.level === 3 || this.level === 10)
            this.chooseClass();
    }

    chooseClass()
    {
        let classes;
        let weights;
        if (this.classLevel === 0)
        {
            classes = ["fighter", "wizard", "rogue"];
            weights = [
                Math.round(Fighter.mainStats.reduce((a, b) => a + this[b], 0) / Fighter.mainStats.length),
                Math.round(Wizard.mainStats.reduce((a, b) => a + this[b], 0) / Wizard.mainStats.length),
                Math.round(Rogue.mainStats.reduce((a, b) => a + this[b], 0) / Rogue.mainStats.length)
            ];

            console.log(weights);

            switch (classes[Utils.getRandomItem(weights)])
            {
                case "fighter":
                    this.class = new Fighter();
                    break;
                case "wizard":
                    this.class = new Wizard(this);
                    break;
                case "rogue":
                    this.class = new Rogue();
                    break;
            }
        }

        console.log(this.class);

        this.classLevel++;
        this.updateStats();
    }

    regenerate()
    {
        if (typeof this.class.regenerate === "function")
            this.class.regenerate(this);
        else if (this.doing.step % 2 === 0)
            this.heal(this.getVitality() * 5);
    }
}