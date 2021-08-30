import {Class} from "../Class.js";
import {images} from "../main.js";

export class Wizard extends Class
{
    static mainStats = ["intelligence"];

    constructor()
    {
        let sprites = {
            walk1: images["WizardWalking1"],
            walk2: images["WizardWalking2"],
            attack1: images["WizardAttack1"],
            attack2: images["WizardAttack2"],
            castFireball1: images["WizardFireball1"],
            castFireball2: images["WizardAttack2"]
        };
        super(0, 0, 0, 0, 1, 0, sprites);
    }

    resolveCombatAction(hero)
    {
        let random = Math.random() * 99 + 1;
        if (random <= 10)
            hero.doing.action = "castFireball";
        else
            hero.doing.action = "attack";
        hero.doing.step = 1;
        hero.doing.target = hero.chooseTarget();
        hero.doing.end = false;
    }

    castFireball(hero)
    {
        if (hero.doing.step === 1)
        {
            if (hero.doing.target.checkHit())
                hero.doing.target.takeDamage(hero.getIntelligence() * 11);
        }
        else if (hero.doing.step === 2)
        {
            hero.doing.end = true;
        }
    }

    takeDamage(damage, hero)
    {
        hero.currentHealth -= Math.round(damage * (1 - Math.min((hero.getDefense()) * 0.05, 0.9))) - this.currentMagicShield;
        this.currentMagicShield -= Math.round(damage * (1 - Math.min((hero.getDefense()) * 0.05, 0.9)));
    }

    getMainStats()
    {
        return Wizard.mainStats;
    }

    setIntelligence(newIntelligence, hero)
    {
        hero.intelligence = newIntelligence;
        this.maxMagicShield = hero.getIntelligence() / 100 * hero.maxHealth;
        this.currentMagicShield = this.maxMagicShield;

    }

    regenerate(hero)
    {
        if (hero.doing.step % 2 === 0)
        {
            hero.heal(hero.getVitality() * 5);
            this.currentMagicShield = this.maxMagicShield;
        }
    }
}