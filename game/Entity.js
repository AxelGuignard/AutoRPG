import {Utils} from "./Utils.js";

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
        this.doing = {action: "idle", step: 1, target: null, end: false};
        this.direction = Math.round(Math.random() * 3 + 1);
    }

    getVitality()
    {
        if (typeof this.class === "object")
            return this.vitality + this.class.vitalityModifier;
        return this.vitality;
    }

    setVitality(newVitality)
    {
        if (typeof this.class === "object" && typeof this.class.setVitality === "function")
            this.class.setVitality(newVitality, this);
        else
        {
            let difference = this.getVitality() * 100 - this.maxHealth;
            this.vitality = newVitality;
            this.maxHealth = this.getVitality() * 100;
            this.currentHealth += difference;
        }
    }

    getStrength()
    {
        if (typeof this.class === "object")
            return this.strength + this.class.strengthModifier;
        return this.strength;
    }

    setStrength(newStrength)
    {
        if (typeof this.class === "object" && typeof this.class.setStrength === "function")
            this.class.setStrength(newStrength, this);
        else
            this.strength = newStrength;
    }


    getDefense()
    {
        if (typeof this.class === "object")
            return this.defense + this.class.defenseModifier;
        return this.defense;
    }

    setDefense(newDefense)
    {
        if (typeof this.class === "object" && typeof this.class.setDefense === "function")
            this.class.setDefense(newDefense, this);
        else
            this.defense = newDefense;
    }

    getAgility()
    {
        if (typeof this.class === "object")
            return this.agility + this.class.agilityModifier;
        return this.agility;
    }

    setAgility(newAgility)
    {
        if (typeof this.class === "object" && typeof this.class.setAgility === "function")
            this.class.setAgility(newAgility, this);
        else
            this.agility = newAgility;
    }

    getIntelligence()
    {
        if (typeof this.class === "object")
            return this.intelligence + this.class.intelligenceModifier;
        return this.intelligence;
    }

    setIntelligence(newIntelligence)
    {
        if (typeof this.class === "object" && typeof this.class.setIntelligence === "function")
            this.class.setIntelligence(newIntelligence, this);
        else
            this.intelligence = newIntelligence;
    }

    raiseStats(points)
    {
        let stats = ["vitality", "strength", "defense", "agility", "intelligence"];
        let weights = [1, 1, 1, 1, 1];
        if (this.hasOwnProperty("class"))
        {
            for (let stat of this.class.getMainStats())
            {
                weights[stats.indexOf(stat)] += 3;
            }
        }

        while (points > 0)
        {
            this[stats[Utils.getRandomItem(weights)]]++;
            points--;
        }

        this.updateStats();
    }

    /**
     * Returns a random foe to target in battle
     * @return {Entity}
     */
    chooseTarget()
    {
        let selfParticipant = this.inBattle.participants[this.inBattle.participants.map((object) => {return object["participant"]}).indexOf(this)];
        let targetsAggro = [];
        let weight;
        for (let foe of selfParticipant.foes)
        {
            weight = foe.baseAggro;
            if (foe.hasOwnProperty("class"))
                weight += foe.class.aggroModifier;
            targetsAggro.push(weight);
        }

        return selfParticipant.foes[Utils.getRandomItem(targetsAggro)];
    }

    resolveCombatAction()
    {
        this.doing.action = "attack";
        this.doing.step = 1;
        this.doing.target = this.chooseTarget();
        this.doing.end = false;
    }

    attack()
    {
        if (this.doing.step === 1)
        {
            if (this.doing.target.checkHit())
                this.doing.target.takeDamage(this.getStrength() * 10);
        }
        else if (this.doing.step === 2)
        {
            this.doing.end = true;
        }
    }

    checkHit()
    {
        let random = Math.random() * 99 + 1;
        return random > this.getAgility();
    }

    takeDamage(damage)
    {
        this.currentHealth -= Math.round(damage * (1 - Math.min(this.getDefense() * 0.05, 0.9)));
    }

    walk()
    {
        this.cell.occupiedBy = null;
        if (this.doing.step === 1)
        {
            let newCell;
            switch (this.direction)
            {
                case 1:
                    newCell = this.doing.target.getCell({x: this.cell.position.x + 1, y: this.cell.position.y});
                    if (typeof newCell !== "undefined")
                        this.cell = newCell;
                    else
                    {
                        this.cell = this.doing.target.getRandomBorder();
                        this.direction = this.getDirection(this.doing.target);
                    }
                    break;
                case 2:
                    newCell = this.doing.target.getCell({x: this.cell.position.x, y: this.cell.position.y + 1});
                    if (typeof newCell !== "undefined")
                        this.cell = newCell;
                    else
                    {
                        this.cell = this.doing.target.getRandomBorder();
                        this.direction = this.getDirection(this.doing.target);
                    }
                    break;
                case 3:
                    newCell = this.doing.target.getCell({x: this.cell.position.x - 1, y: this.cell.position.y});
                    if (typeof newCell !== "undefined")
                        this.cell = newCell;
                    else
                    {
                        this.cell = this.doing.target.getRandomBorder();
                        this.direction = this.getDirection(this.doing.target);
                    }
                    break;
                case 4:
                    newCell = this.doing.target.getCell({x: this.cell.position.x, y: this.cell.position.y - 1});
                    if (typeof newCell !== "undefined")
                        this.cell = newCell;
                    else
                    {
                        this.cell = this.doing.target.getRandomBorder();
                        this.direction = this.getDirection(this.doing.target);
                    }
                    break;
            }
            this.cell.occupiedBy = this;
        }
        else if (this.doing.step === 2)
        {
            this.doing.end = true;
        }
    }

    mate()
    {
        // TODO
    }

    formParty()
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
        this.doing = {action: "idle", step: 1, target: null, end: false};
    }

    gainExperience(experience)
    {
        this.xp += Math.round(experience * (1 + this.getIntelligence() / 100));
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
            this.heal(this.getVitality() * 5);
    }

    heal(health)
    {
        this.currentHealth = Math.min(this.currentHealth + health, this.maxHealth);
    }

    updateStats()
    {
        this.setVitality(this.vitality);
        this.setStrength(this.strength);
        this.setDefense(this.defense);
        this.setAgility(this.agility);
        this.setIntelligence(this.intelligence);
    }
}