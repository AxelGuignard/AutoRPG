export class Class
{
    /**
     * @constant
     * @abstract
     */
    static mainStats;

    constructor(vitalityModifier, strengthModifier, defenseModifier, agilityModifier, intelligenceModifier, aggroModifier, sprites)
    {
        this.vitalityModifier = vitalityModifier;
        this.strengthModifier = strengthModifier;
        this.defenseModifier = defenseModifier;
        this.agilityModifier = agilityModifier;
        this.intelligenceModifier = intelligenceModifier;
        this.aggroModifier = aggroModifier;
        this.sprites = sprites;
    }

    /**
     * @abstract
     * @return {Array}
     */
    getMainStats()
    {
        return Class.mainStats;
    }
}