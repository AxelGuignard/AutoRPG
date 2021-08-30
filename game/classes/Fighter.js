import {Class} from "../Class.js";
import {images} from "../main.js";

export class Fighter extends Class
{
    static mainStats = ["strength", "defense", "vitality"];

    constructor()
    {
        let sprites = {
            walk1: images["FighterWalking1"],
            walk2: images["FighterWalking2"],
            attack1: images["FighterAttack1"],
            attack2: images["FighterAttack2"]
        };
        super(1, 0, 1, 0, 0, 1, sprites);
    }

    getMainStats()
    {
        return Fighter.mainStats;
    }
}