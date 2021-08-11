import {Entity} from "../Entity.js";
import {Pegu} from "../classes/Pegu.js";

export class Hero extends Entity
{
    constructor(cell)
    {
        super(cell);
        this.vitality = 1;
        this.strength = 1;
        this.defense = 1;
        this.agility = 1;
        this.intelligence = 1;
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
}