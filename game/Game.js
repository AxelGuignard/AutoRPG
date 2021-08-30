import {Hero} from "./entities/Hero.js";
import {Party} from "./entities/Party.js";
import {Battle} from "./Battle.js";
import {Monster} from "./entities/Monster.js";
import {Goblin} from "./entities/monsters/Goblin.js";

export class Game
{
    constructor(viewport, grid, mode = "auto")
    {
        this.mode = mode;
        this.viewport = viewport;
        this.grid = grid;
        this.tickTime = 1000; // Time between each update and frames. Default to 1s.
        this.entities = [];
        this.battles = [];
        this.update = this.update.bind(this);
        this.updateTimeoutId = null;
        this.init();
    }

    init()
    {
        this.grid.init(this.viewport);
        this.update();
    }

    update()
    {
        this.drawBackground();

        // entities with no hp left die
        for (let battle of this.battles)
        {
            for (let participant of battle.participants)
            {
                if (participant.participant instanceof Party)
                {
                    for (let member of participant.participant.members)
                    {
                        if (member.currentHealth <= 0)
                        {
                            for (let foe of participant.foes)
                            {
                                foe.gainExperience(member.level * 10 / participant.foes.length);
                            }
                            this.deleteEntity(participant.participant);
                        }
                    }
                }
                else if (participant.participant.currentHealth <= 0)
                {
                    for (let foe of participant.foes)
                    {
                        foe.gainExperience(participant.participant.level * 10 / participant.foes.length);
                    }
                    this.deleteEntity(participant.participant);
                }
            }

            let foesNbr = 0;
            for (let participant of battle.participants)
            {
                foesNbr += participant.foes.length;
            }

            if (foesNbr === 0)
            {
                for (let participant of battle.participants)
                {
                    participant.participant.inBattle = null;
                }
                this.battles.splice(this.battles.indexOf(battle), 1);
            }
        }

        // monsters and monster parties draw nearby heroes or heroes parties in battle
        for (let monster of this.entities)
        {
            if (monster instanceof Monster || monster instanceof Party && monster.type === "monster")
            {
                let adjacentCells = this.grid.getAdjacentCells(monster.cell);
                for (let cell of adjacentCells)
                {
                    if (cell.occupiedBy instanceof Hero || cell.occupiedBy instanceof Party && cell.occupiedBy.type === "hero")
                    {
                        if (cell.occupiedBy.inBattle === null)
                        {
                            if (monster.inBattle !== null)
                                monster.inBattle.addParticipant(cell.occupiedBy, monster);
                            else
                            {
                                let battle = new Battle([{participant: monster, foes: [cell.occupiedBy]}, {participant: cell.occupiedBy, foes: [monster]}]);
                                monster.inBattle = battle;
                                this.battles.push(battle);
                            }

                            cell.occupiedBy.inBattle = monster.inBattle;
                        }
                        else
                        {
                            if (monster.inBattle !== null)
                            {
                                cell.occupiedBy.inBattle.fuseBattle(monster.inBattle);
                            }

                            cell.occupiedBy.inBattle.addParticipant(monster, cell.occupiedBy);
                            monster.inBattle = cell.occupiedBy.inBattle;
                        }
                    }
                }
            }
        }

        // everyone plan its next action
        for (let entity of this.entities)
        {
            if (entity.doing.action === "idle")
            {
                if (entity.inBattle !== null)
                {
                    entity.resolveCombatAction();
                }
                else if (entity instanceof Hero || entity instanceof Party && entity.type === "hero")
                {
                    let adjacentCells = this.grid.getAdjacentCells(entity.cell);
                    for (let cell of adjacentCells)
                    {
                        if (typeof cell !== "undefined" && cell.occupiedBy !== null && (cell.occupiedBy instanceof Hero || cell.occupiedBy instanceof Party && cell.occupiedBy.type === "hero"))
                        {
                            let random = Math.random() * 99 + 1;
                            if (random <= 20 && (cell.occupiedBy.doing.action === "walk" || cell.occupiedBy.doing.action === "idle") && !cell.occupiedBy instanceof Party)
                            {
                                entity.doing.action = "mate";
                                entity.doing.step = 1;
                                entity.doing.target = cell.occupiedBy;
                                entity.doing.end = false;
                                cell.occupiedBy.doing.action = "mate";
                                cell.occupiedBy.doing.step = 1;
                                cell.occupiedBy.doing.target = entity;
                                cell.occupiedBy.doing.end = false;
                            }
                            else if (random > 20 && random <= 40 && (cell.occupiedBy.doing.action === "walk" || cell.occupiedBy.doing.action === "idle") && !(cell.occupiedBy instanceof Party && cell.occupiedBy.members.length >= 4))
                            {
                                entity.doing.action = "formParty";
                                entity.doing.step = 1;
                                entity.doing.target = cell.occupiedBy;
                                entity.doing.end = false;
                                cell.occupiedBy.doing.action = "formParty";
                                cell.occupiedBy.doing.step = 1;
                                cell.occupiedBy.doing.target = entity;
                                cell.occupiedBy.doing.end = false;
                            }
                            else if (random > 40 && random <= 60 && cell.occupiedBy.doing.action !== "mate" && cell.occupiedBy.doing.action !== "formParty")
                            {
                                if (cell.occupiedBy.inBattle !== null)
                                {
                                    cell.occupiedBy.inBattle.addParticipant(entity, cell.occupiedBy);
                                    entity.inBattle = cell.occupiedBy.inBattle;
                                } else
                                {
                                    let battle = new Battle([{
                                        participant: entity,
                                        foes: [cell.occupiedBy]
                                    }, {participant: cell.occupiedBy, foes: [entity]}]);
                                    entity.inBattle = battle;
                                    this.battles.push(battle);
                                }
                                entity.resolveCombatAction();
                            }
                        }
                    }
                    if (entity.doing.action === "idle")
                    {
                        entity.doing.action = "walk";
                        entity.doing.step = 1;
                        entity.doing.target = this.grid;
                        entity.doing.end = false;
                    }
                }
            }

            if (this.mode === "auto")
            {
                let heroNbr = 0;
                for (let entity of this.entities)
                {
                    if (entity instanceof Hero || entity instanceof Party && entity.type === "hero")
                        heroNbr++;
                }
                if (heroNbr < 2)
                {
                    this.addHero();
                }
            }
        }

        // resolve actions
        for (let entity of this.entities)
        {
            if (typeof entity[entity.doing.action] === "function")
                entity[entity.doing.action]();
            else if (typeof entity.class === "object" && typeof entity.class[entity.doing.action] === "function")
                entity.class[entity.doing.action](entity);
            this.drawAction(entity);
            if (entity.inBattle === null)
                entity.regenerate();
            entity.doing.step++;
            if (entity.doing.end)
                entity.reinitializeAction();
        }

        // generate new entities
        let random;
        for (let cell of this.grid.cells)
        {
            random = Math.round(Math.random() * 599 + 1);
            if (random === 1)
                this.addMonster();
        }

        // debug
        console.log(this.entities.map(entity => [
            entity.currentHealth + "/",
            entity.maxHealth,
            entity.doing.action,
            "step: " + entity.doing.step,
            "experience: " + entity.xp,
            "level: " + entity.level,
            typeof entity.class === "object" ? entity.class : "monster",
            [
                "vitality: " + entity.vitality,
                "strength: " + entity.strength,
                "defense: " + entity.defense,
                "agility: " + entity.agility,
                "intelligence: " + entity.intelligence
            ]
        ]));

        this.updateTimeoutId = setTimeout(this.update, this.tickTime);
    }

    addHero(position = null)
    {
        let cell = null;
        if (position !== null)
        {
            cell = this.grid.getCell(position);
            if (cell.occupiedBy !== null)
                return false;
        }
        else
        {
            while (cell === null)
            {
                cell = this.grid.getCell({x: Math.round(Math.random() * (this.grid.size.x - 2) + 1), y: Math.round(Math.random() * (this.grid.size.y - 2) + 1)});
                if (cell.occupiedBy !== null)
                    cell = null;
            }
        }
        this.entities.push(new Hero(cell));
    }

    addMonster(position = null)
    {
        let cell = null;
        if (position !== null)
        {
            cell = this.grid.getCell(position);
            if (cell.occupiedBy !== null)
                return false;
        }
        else
        {
            while (cell === null)
            {
                cell = this.grid.getCell({x: Math.round(Math.random() * (this.grid.size.x - 2) + 1), y: Math.round(Math.random() * (this.grid.size.y - 2) + 1)});
                if (cell.occupiedBy !== null)
                    cell = null;
            }
        }

        let random = Math.random() * 99 + 1;
        let monster;
        if (random <= 100) // add new monsters when ready
        {
            monster = new Goblin(cell);
        }

        this.entities.push(monster);
    }

    drawBackground()
    {
        for (let cell of this.grid.cells)
        {
            this.viewport.getCtx().drawImage(cell.sprite, cell.position.x * this.grid.cellSize, cell.position.y * this.grid.cellSize, this.grid.cellSize, this.grid.cellSize);
        }
    }

    drawAction(entity)
    {
        this.viewport.getCtx().drawImage(entity.getSprite(entity.doing.action + (entity.doing.step % 2 ? 1 : 2)), entity.cell.position.x * this.grid.cellSize, entity.cell.position.y * this.grid.cellSize, this.grid.cellSize, this.grid.cellSize);
    }

    deleteEntity(entity)
    {
        if (entity.inParty)
        {
            // TODO delete from party
        }
        if (entity.inBattle !== null)
        {
            // Here, we "simply" get an array of foes for each participant, that we then parse to find and delete the entity from the foes of every participant
            let participantFoes = entity.inBattle.participants.map(participant => {return participant.foes});
            for (let foes of participantFoes)
            {
                entity.inBattle.participants[participantFoes.indexOf(foes)].foes.splice(foes.indexOf(entity), 1);
            }
            // Then, we delete the entity from the participants
            entity.inBattle.participants.splice(entity.inBattle.participants.map(participant => {return participant.participant}).indexOf(entity), 1);
        }
        this.entities.splice(this.entities.indexOf(entity), 1);
    }
}