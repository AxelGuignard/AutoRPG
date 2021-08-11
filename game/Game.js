import {Hero} from "./entities/Hero.js";

export class Game
{
    constructor(viewport, grid)
    {
        this.viewport = viewport;
        this.grid = grid;
        this.tickTime = 1000; // Time between each update and frames. Default to 1s.
        this.heroes = [];
        this.monsters = [];
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
        this.heroes.push(new Hero(cell));
    }

    drawBackground()
    {
        for (let cell of this.grid.cells)
        {
            this.viewport.getCtx().drawImage(cell.sprite, cell.position.x * this.grid.cellSize, cell.position.y * this.grid.cellSize, this.grid.cellSize, this.grid.cellSize);
        }
    }
}