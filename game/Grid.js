import {Cell} from "./Cell.js";

export class Grid
{
    /**
     * @param {Object} size {x, y} Number of cells in each direction
     */
    constructor(size)
    {
        this.size = size;
        /** @type {Cell[]} */
        this.cells = [];
        this.cellSize = 0;
    }

    init(viewport)
    {
        for (let i = 0; i < this.size.x; i++)
        {
            for (let j = 0; j < this.size.y; j++)
            {
                this.cells.push(new Cell({x: i, y: j}));
            }
        }
        this.setCellSize(viewport);
    }

    /**
     * @param {Viewport} viewport
     */
    setCellSize(viewport)
    {
        if (this.size.x >= this.size.y)
            this.cellSize = viewport.getWidth() / this.size.x;
        else
            this.cellSize = viewport.getHeight() / this.size.y;
    }

    getCell(position)
    {
        for (let cell of this.cells)
        {
            if (cell.position.x === position.x && cell.position.y === position.y)
                return cell;
        }
    }
}