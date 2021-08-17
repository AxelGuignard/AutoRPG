import {images} from "../main.js";
import {Class} from "../Class.js";

export class Pegu extends Class
{
    constructor()
    {
        super(0, 0, 0, 0, 0, 0, [], {walk1: images["PeguWalking1"], walk2: images["PeguWalking2"], attack1: images["PeguAttack1"], attack2: images["PeguWalking2"], mate1: null /* images["PeguMate1"] */, mate2: null /*images["PeguMate2"]*/});
    }
}