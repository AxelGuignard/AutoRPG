import {Entity} from "../Entity.js";
import {Hero} from "./Hero.js";

export class Party extends Entity
{
    /**
     * @param {Cell} cell cell of the hero or monster that formed the party
     * @param {Entity[]} members array of heroes or monsters in the party (up to 4)
     */
    constructor(cell, members)
    {
        super(cell);
        this.members = members;
        if (members[0] instanceof Hero)
            this.type = "hero";
        else
            this.type = "monster";
    }
}