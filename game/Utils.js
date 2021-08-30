export class Utils
{
    /**
     * Output a random key from an array of weights
     * @param {Array} list
     */
    static getRandomItem(list)
    {
        if (list.length > 0)
        {
            let totalWeights = list.reduce((a, b) => a + b);
            let currentThreshold = 0;
            let nextThreshold;
            let random = Math.random() * 99 + 1;
            for (let i = 0; i < list.length; i++)
            {
                nextThreshold = list[i] / totalWeights * 100 + currentThreshold;
                if (random >= currentThreshold && random < nextThreshold)
                    return i;
                currentThreshold = nextThreshold;
            }
        }
    }
}