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

    raiseStats(points)
    {
        let weights = {vitality: 1, strength: 1, defense: 1, agility: 1, intelligence: 1};
        for (let stat of this.class.mainStats)
        {
            weights[stat] += 3;
        }

        let random = 0;
        let totalWeights = Object.values(weights).reduce((a, b) => a + b);
        let thresholds = {vitality: 0, strength: 0, defense: 0, agility: 0, intelligence: 100};
        thresholds.vitality = weights.vitality / totalWeights * 100;
        thresholds.strength = thresholds.vitality + weights.strength / totalWeights * 100;
        thresholds.defense = thresholds.strength + weights.defense / totalWeights * 100;
        thresholds.agility = thresholds.defense + weights.agility / totalWeights * 100;

        while (points > 0)
        {
            random = Math.random() * 99 + 1;
            if (random <= thresholds.vitality)
            {
                this.vitality++;
            }
            else if (random > thresholds.vitality && random <= thresholds.strength)
            {
                this.strength++;
            }
            else if (random > thresholds.strength && random <= thresholds.defense)
            {
                this.defense++;
            }
            else if (random > thresholds.defense && random <= thresholds.agility)
            {
                this.agility++;
            }
            else if (random > thresholds.agility)
            {
                this.intelligence++;
            }
            points--;
        }
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
        if (typeof this.class.attack === "function")
            this.class.attack(target, this);
        else
            target.takeDamage(this.strength + this.class.strengthModifier);
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
            this.currentHealth -= damage * (1 - Math.min(Math.round((this.defense + this.class.defenseModifier) * 0.05), 0.9));
    }

    getSprite(sprite) {
        return this.class.sprites[sprite];
    }
}