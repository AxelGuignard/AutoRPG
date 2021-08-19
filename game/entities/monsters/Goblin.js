import {Monster} from "../Monster.js";
import {images} from "../../main.js";

export class Goblin extends Monster
{
    constructor(cell) {
        super(cell, 1, 1, 1, 1, 1, 1, {idle1: images["GoblinIdle1"], idle2: images["GoblinIdle1"], attack1: images["GoblinAttack1"], attack2: images["GoblinIdle1"]});
    }
}