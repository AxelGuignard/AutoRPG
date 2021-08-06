import {Cell} from "./Cell";

export class Grid
{
    /**
     * @param {Object} size {x, y} Number of cells in each direction
     */
    constructor(size)
    {
        this.size = size;
        this.cells = [];
        this.init();
    }

    init()
    {
        for (let i = 0; i < this.size.x; i++)
        {
            for (let j = 0; j < this.size.y; j++)
            {
                this.cells.push(new Cell({x: i, y: j}));
            }
        }
    }
}