export class Battle
{
    /**
     * @param {Object[]} participants [{participant: Entity, foes: Entity[]}] array of objects defining participants and their respective foes
     * Entities can be heroes, monsters or parties
     */
    constructor(participants)
    {
        this.participants = participants;
    }

    /**
     * @param {Entity} participant
     * @param {Entity} foe
     */
    addParticipant(participant, foe)
    {
        this.participants.push({participant: participant, foes: [foe]});
        this.participants[this.participants.map((object) => {return object["participant"]}).indexOf(foe)].foes.push(participant);
    }

    fuseBattle(battle)
    {
        for (let participant of battle.participants)
        {
            this.participants.push(participant);
            participant.participant.inBattle = this;
        }
    }
}