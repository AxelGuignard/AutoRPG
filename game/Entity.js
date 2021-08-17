export class Entity
{
    constructor(cell, vitality, strength, defense, agility, intelligence, baseAggro, sprites)
    {
        this.vitality = vitality;
        this.strength = strength;
        this.defense = defense;
        this.agility = agility;
        this.intelligence = intelligence;
        this.maxHealth = vitality * 10;
        this.currentHealth = this.maxHealth;
        this.baseAggro = baseAggro;
        this.sprites = sprites;
        this.cell = cell;
        this.inBattle = null;
        this.doing = {action: null, step: 0, target: null};
        this.direction = Math.round(Math.random() * 3 + 1);
    }

    /**
     * Returns a random foe to target in battle
     * @return {Entity|void}
     */
    chooseTarget()
    {
        let selfParticipant = this.inBattle.participants[this.inBattle.participants.map((object) => {return object["participant"]}).indexOf(this)];
        let random = Math.random() * 99 + 1;
        let targetsAggro = [];
        let weight;
        for (let foe of selfParticipant.foes)
        {
            weight = 1 + foe.baseAggro;
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
        this.doing = {action: "attack", step: 0, target: this.chooseTarget()};
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
                target.takeDamage(this.strength);
            this.doing.step++;
        }
    }

    checkHit()
    {
        let random = Math.random() * 99 + 1;
        return random > this.agility;
    }

    takeDamage(damage)
    {
        this.currentHealth -= damage * (1 - Math.min(Math.round(this.defense * 0.05), 0.9));
    }

    /**
     * @param {Number} step
     * @param {Grid} target
     */
    walk(step, target)
    {
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
        }
    }

    mate()
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
}