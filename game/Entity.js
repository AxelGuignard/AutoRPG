export class Entity
{
    constructor(cell, vitality, strength, defense, agility, intelligence, baseAggro, sprites, level = 1)
    {
        this.vitality = vitality;
        this.strength = strength;
        this.defense = defense;
        this.agility = agility;
        this.intelligence = intelligence;
        this.maxHealth = vitality * 100;
        this.currentHealth = this.maxHealth;
        this.baseAggro = baseAggro;
        this.sprites = sprites;
        this.level = level;
        this.xp = 0;
        this.xpToLevelUp = 10 * this.level;
        this.cell = cell;
        this.inBattle = null;
        this.inParty = null;
        this.doing = {action: "idle", step: 0, target: null, end: true};
        this.direction = Math.round(Math.random() * 3 + 1);
    }

    raiseStats(points)
    {
        let weights = {vitality: 1, strength: 1, defense: 1, agility: 1, intelligence: 1};
        if (this.hasOwnProperty("class"))
        {
            for (let stat of this.class.mainStats)
            {
                weights[stat] += 3;
            }
        }

        let random;
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
                this.maxHealth = this.vitality * 100;
                this.currentHealth += 100;
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

    /**
     * Returns a random foe to target in battle
     * @return {Entity}
     */
    chooseTarget()
    {
        let selfParticipant = this.inBattle.participants[this.inBattle.participants.map((object) => {return object["participant"]}).indexOf(this)];
        let random = Math.random() * 99 + 1;
        let targetsAggro = [];
        let weight;
        for (let foe of selfParticipant.foes)
        {
            weight = foe.baseAggro;
            if (foe.hasOwnProperty("class"))
                weight += foe.class.aggroModifier;
            targetsAggro.push(weight);
        }

        let totalWeights = targetsAggro.reduce((a, b) => a + b);
        let currentThreshold = 0;
        for (let i = 0; i < targetsAggro.length; i++)
        {
            let targetThreshold = targetsAggro[i] / totalWeights * 100 + currentThreshold;
            if (random >= currentThreshold && random < targetThreshold)
                return selfParticipant.foes[i];
            currentThreshold += targetThreshold;
        }
    }

    resolveCombatAction()
    {
        this.doing.action = "attack";
        this.doing.step = 1;
        this.doing.target = this.chooseTarget();
        this.doing.end = false;
    }

    /**
     * @param {Number} step
     * @param {Entity} target
     */
    attack(step, target)
    {
        if (step === 1)
        {
            if (target.checkHit())
                target.takeDamage(this.strength * 10);
        }
        else if (step === 2)
        {
            this.doing.end = true;
        }
    }

    checkHit()
    {
        let random = Math.random() * 99 + 1;
        return random > this.agility;
    }

    takeDamage(damage)
    {
        this.currentHealth -= Math.round(damage * (1 - Math.min(this.defense * 0.05, 0.9)));
    }

    /**
     * @param {Number} step
     * @param {Grid} target
     */
    walk(step, target)
    {
        this.cell.occupiedBy = null;
        if (step === 1)
        {
            let newCell;
            switch (this.direction)
            {
                case 1:
                    newCell = target.getCell({x: this.cell.position.x + 1, y: this.cell.position.y});
                    if (typeof newCell !== "undefined")
                        this.cell = newCell;
                    else
                    {
                        this.cell = target.getRandomBorder();
                        this.direction = this.getDirection(target);
                    }
                    break;
                case 2:
                    newCell = target.getCell({x: this.cell.position.x, y: this.cell.position.y + 1});
                    if (typeof newCell !== "undefined")
                        this.cell = newCell;
                    else
                    {
                        this.cell = target.getRandomBorder();
                        this.direction = this.getDirection(target);
                    }
                    break;
                case 3:
                    newCell = target.getCell({x: this.cell.position.x - 1, y: this.cell.position.y});
                    if (typeof newCell !== "undefined")
                        this.cell = newCell;
                    else
                    {
                        this.cell = target.getRandomBorder();
                        this.direction = this.getDirection(target);
                    }
                    break;
                case 4:
                    newCell = target.getCell({x: this.cell.position.x, y: this.cell.position.y - 1});
                    if (typeof newCell !== "undefined")
                        this.cell = newCell;
                    else
                    {
                        this.cell = target.getRandomBorder();
                        this.direction = this.getDirection(target);
                    }
                    break;
            }
            this.cell.occupiedBy = this;
        }
        else if (step === 2)
        {
            this.doing.end = true;
        }
    }

    mate()
    {
        // TODO
    }

    formParty(step, target)
    {
        // TODO
    }

    getSprite(sprite)
    {
        return this.sprites[sprite];
    }

    getDirection(grid)
    {
        if (this.cell.position.x === 0 && this.cell.position.y === 0)
            return Math.round(Math.random()) ? 1 : 2;
        else if (this.cell.position.x === 0 && this.cell.position.y === grid.size.y - 1)
            return Math.round(Math.random()) ? 4 : 1;
        else if (this.cell.position.x === grid.size.x - 1 && this.cell.position.y === 0)
            return Math.round(Math.random()) ? 2 : 3;
        else if (this.cell.position.x === grid.size.x - 1 && this.cell.position.y === grid.size.y - 1)
            return Math.round(Math.random()) ? 3 : 4;
        else if (this.cell.position.x === 0)
            return 1;
        else if (this.cell.position.y === 0)
            return 2;
        else if (this.cell.position.x === grid.size.x - 1)
            return 3;
        else if (this.cell.position.y === grid.size.y - 1)
            return 4;
    }

    reinitializeAction()
    {
        this.doing = {action: "idle", step: 0, target: null, end: true};
    }

    gainExperience(experience)
    {
        this.xp += experience;
        if (this.xp >= this.xpToLevelUp)
        {
            this.xp -= this.xpToLevelUp;
            this.gainLevel();
        }
    }

    gainLevel()
    {
        this.level++;
        this.raiseStats(2);
        this.xpToLevelUp = this.level * 10;
    }

    regenerate()
    {
        if (this.doing.step % 2 === 0)
            this.heal(this.vitality * 5);
    }

    heal(health)
    {
        this.currentHealth = Math.min(this.currentHealth + health, this.maxHealth);
    }
}