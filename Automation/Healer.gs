/*
 * Cast the Aura spell.
 */
function aura() {
  const { mana } = HabiticaApiClient.getUser(CONFIG)

  Logger.log(`You have ${Math.floor(mana)} mana`)

  if (mana < CONFIG.aura.cost) {
    Logger.log('You do not have enough mana to cast Protective Aura')
    return
  }

  if (mana > CONFIG.aura.threshold) {
    Logger.log('Casting Protective Aura')
    HabiticaApiClient.castSpell('protectAura', CONFIG)
  }
}

/*
 * Cast the Bless spell.
 */
function bless() {
  const { health, mana } = HabiticaApiClient.getUser(CONFIG)

  Logger.log(`You have ${Math.floor(health)} health points`)

  if (mana < CONFIG.bless.cost) {
    Logger.log('You do not have enough mana to cast Blessing')
    return
  }

  if (health < CONFIG.bless.threshold) {
    Logger.log('Health is low, casting Blessing')
    HabiticaApiClient.castSpell('healAll', CONFIG)
  }
}
