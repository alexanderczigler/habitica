function healthPotion() {
  const user = HabiticaApiClient.getUser(CONFIG)

  const hp = Math.floor(user.health)
  const gold = Math.floor(user.gold)
  const mp = Math.floor(user.mana)

  Logger.log(`${gold} g, ${hp} hp, ${mp} mana`)

  if (user.health > CONFIG.healthPotion.healthThreshold) {
    Logger.log('You do not need a health potion at this time.')
    return
  }

  if (CONFIG.healthPotion.hasBlessing && user.mana > CONFIG.healthPotion.manaThreshold) {
    Logger.log('Cast Blessing instead! (Not buying a health potion now.)')
    return
  }

  if (user.gold < CONFIG.healthPotion.cost) {
    Logger.log('You could use a health potion right now, but alas you have to little coin!')
    return
  }

  Logger.log('Buying a health potion!')
  HabiticaApiClient.buyHealthPotion(CONFIG)
}
