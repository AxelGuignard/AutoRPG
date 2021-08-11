import {images} from "./main.js";

export class Cell
{
    /**
     * @param {Object} position {x, y} coordinates of the cell
     */
    constructor(position)
    {
        this.position = position;
        this.sprite = images["Grass"];
        this.occupiedBy = null;
    }

}