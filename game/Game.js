import {Hero} from "./entities/Hero.js";
import {Party} from "./entities/Party.js";
import {Battle} from "./Battle.js";
import {Monster} from "./entities/Monster.js";

export class Game
{
    constructor(viewport, grid)
    {
        this.viewport = viewport;
        this.grid = grid;
        this.tickTime = 1000; // Time between each update and frames. Default to 1s.
        this.entities = [];
        this.update = this.update.bind(this);
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
        // TODO

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
                                monster.inBattle = new Battle([{participant: monster, foes: [cell.occupiedBy]}, {participant: cell.occupiedBy, foes: [monster]}]);

                            cell.occupiedBy.inBattle = monster.inBattle;
                        }
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

        // everyone plan its next action
        for (let entity of this.entities)
        {
            if (entity.inBattle !== null)
            {
                entity.resolveCombatAction();
            }
            else if (entity instanceof Hero  && entity.doing.action !== "mate" || entity instanceof Party && entity.type === "hero")
            {
                let adjacentCells = this.grid.getAdjacentCells(entity.cell);
                for (let cell of adjacentCells)
                {
                    if (typeof cell !== "undefined" && cell.occupiedBy !== null && (cell.occupiedBy instanceof Hero || cell.occupiedBy instanceof Party && cell.occupiedBy.type === "hero"))
                    {
                        let random = Math.random() * 99 + 1;
                        if (random <= 20 && (cell.occupiedBy.doing.action === "walk" || cell.occupiedBy.doing.action === null) && !cell.occupiedBy instanceof Party)
                        {
                            entity.doing = {action: "mate", step: 1, target: cell.occupiedBy};
                            cell.occupiedBy.doing = {action: "mate", step: 1, target: entity};
                        }
                        else if (random > 20 && random <= 40 && (cell.occupiedBy.doing.action === "walk" || cell.occupiedBy.doing.action === null) && !(cell.occupiedBy instanceof Party && cell.occupiedBy.members.length >= 4))
                        {
                            entity.doing = {action: "formParty", step: 1, target: cell.occupiedBy};
                            cell.occupiedBy.doing = {action: "formParty", step: 1, target: entity};
                        }
                        else if (random > 40 && random <= 60 && cell.occupiedBy.doing.action !== "mate" && cell.occupiedBy.doing.action !== "formParty")
                        {
                            if (cell.occupiedBy.inBattle !== null)
                            {
                                cell.occupiedBy.inBattle.addParticipant(entity, cell.occupiedBy);
                                entity.inBattle = cell.occupiedBy.inBattle;
                            }
                            else
                            {
                                entity.inBattle = new Battle([{participant: entity, foes: [cell.occupiedBy]}, {participant: cell.occupiedBy, foes: [entity]}]);
                            }
                            entity.resolveCombatAction();
                        }
                    }
                }
            }
            if (entity.doing.action === "walk" || entity.doing.action === null)
                entity.doing = {action: "walk", step: 1, target: this.grid}
        }

        // resolve first part actions
        for (let entity of this.entities)
        {
            console.log("pouet1");
            entity[entity.doing.action](entity.doing.step, entity.doing.target);
            this.drawAction(entity);
        }

        console.log(this);

        setTimeout(this.update, this.tickTime);
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
                cell = this.grid.getCell({x: Math.round(Math.random() * (this.grid.size.x - 1) + 1), y: Math.round(Math.random() * (this.grid.size.y - 1) + 1)});
                if (cell.occupiedBy !== null)
                    cell = null;
            }
        }
        this.entities.push(new Hero(cell));
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
        console.log(entity);
        console.log(entity.getSprite(entity.doing.action + (entity.doing.step % 2 ? 1 : 2)));
        this.viewport.getCtx().drawImage(entity.getSprite(entity.doing.action + (entity.doing.step % 2 ? 2 : 1)), entity.cell.position.x * this.grid.cellSize, entity.cell.position.y * this.grid.cellSize, this.grid.cellSize, this.grid.cellSize);
    }
}