function armoire() {
  const { gold } = HabiticaApiClient.getUser(CONFIG)

  Logger.log(`You have ${Math.floor(gold)} gold.`)

  if (gold > CONFIG.armoire.threshold) {
    const { data: { armoire } } = HabiticaApiClient.buyArmoire(CONFIG)

    if (armoire.type == 'food') {
       Logger.log(`You gained ${armoire.dropText}`)
     } else {
       Logger.log('You gained ' + armoire.value + ' ' + armoire.type + '.')
       Logger.log(`You gained ${armoire.value} ${armoire.type}`)
     }
  }
}
