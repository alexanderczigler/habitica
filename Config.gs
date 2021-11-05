/*
 * Configuration.
 */

const CONFIG = {
  armoire: {
    threshold: 950,       // Buy an Enchanted Armoire if there at least this much gold.
  },
  aura: {
    cost: 30,             // The mana cost of Aura.
    threshold: 125,       // Cast Protective Aura when mana is above this.
  },
  bless: {
    cost: 25,             // The mana cost of Bless.
    threshold: 45,        // Cast Blessing when health is below this.
  },
  healthPotion: {
    cost: 25,             // The cost of a health potion.
    hasBlessing: true,    // Set to 'true' if you are a Healer.
    healthThreshold: 45,  // Buy health potion if health is below this.
    manaThreshold: 25,
  },
  quest: {
    gracePeriod: 12,      // Force-start quest after this many hours.
  },

  /*
   * NOTE: Enter your UserId and API Token below.
   *       You can find these values here:
   *       https://habitica.com/user/settings/api
   * 
   *       (Never share these with anyone else!)
   */

  userSettings: {
    userId: 'your-user-id',
    apiToken: 'your-api-token',
  },
}
