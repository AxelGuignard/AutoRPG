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

    getAdjacentCells(cell)
    {
        let adjacentCells = [];
        if (this.getCell({x: cell.position.x - 1, y: cell.position.y}) !== null)
            adjacentCells.push(this.getCell({x: cell.position.x - 1, y: cell.position.y}));
        if (this.getCell({x: cell.position.x + 1, y: cell.position.y}) !== null)
            adjacentCells.push(this.getCell({x: cell.position.x + 1, y: cell.position.y}));
        if (this.getCell({x: cell.position.x, y: cell.position.y - 1}) !== null)
            adjacentCells.push(this.getCell({x: cell.position.x, y: cell.position.y - 1}));
        if (this.getCell({x: cell.position.x, y: cell.position.y + 1}) !== null)
            adjacentCells.push(this.getCell({x: cell.position.x, y: cell.position.y + 1}));
        return adjacentCells;
    }

    getRandomBorder()
    {
        let borders = [];
        for (let cell of this.cells)
        {
            if (cell.position.x === 0 || cell.position.x === this.size.x || cell.position.y === 0 || cell.position.y === this.size.y)
                borders.push(cell);
        }

        return borders[Math.round(Math.random() * borders.length)];
    }
}