import {images} from "../main.js";
import {Class} from "../Class.js";

export class Pegu extends Class
{
    constructor()
    {
        super(0, 0, 0, 0, 0, [], images["PeguWalking1"], images["PeguWalking2"]), images["PeguAttack1"], images["PeguWalking2"];
    }
}