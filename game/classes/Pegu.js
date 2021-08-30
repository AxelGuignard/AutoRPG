import {images} from "../main.js";
import {Class} from "../Class.js";

export class Pegu extends Class
{
    static mainStats = [];

    constructor()
    {
        let sprites = {
            walk1: images["PeguWalking1"],
            walk2: images["PeguWalking2"],
            attack1: images["PeguAttack1"],
            attack2: images["PeguWalking2"],
            mate1:  images["PeguWalking1"],
            mate2: images["PeguWalking2"]
        };
        super(0, 0, 0, 0, 0, 0, sprites);
    }

    getMainStats()
    {
        return Pegu.mainStats;
    }
}