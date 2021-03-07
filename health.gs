const config = {
  health: {
    threshold: 45 // Buy health potion if health is below this
  },
  gold: {
    threshold: 25 // The cost of a health potion
  },
  mana: {
    threshold: 25
  },
  spells: {
    hasBlessing: true // If true and config.mana.threshold is met, will not buy a health potion
  },
  user: {
    id: 'your-user-id',
    token: 'your-api-token'
  },
}

function healthPotion() {
  const user = getUser()

  Logger.log(`You have ${Math.floor(user.health)} health points`)
  Logger.log(`You have ${Math.floor(user.gold)} gold`)
  Logger.log(`You have ${Math.floor(user.mana)} mana`)

  if (user.health > config.health.threshold) {
    Logger.log('There are enough health points, exiting')
    return
  }

  if (config.spells.hasBlessing && user.mana > config.mana.threshold) {
    Logger.log('There is enough mana to cast Blessing instead, exiting')
    return
  }

  if (user.gold < config.gold.threshold) {
    Logger.log('There is too little gold for buying a health potion, exiting')
    return
  }

  Logger.log('Buying a health potion')
  call('post', 'https://habitica.com/api/v3/user/buy-health-potion' )
}

/*
 * Helpers.
 */

function getUser() {
  const user = call('get', 'https://habitica.com/api/v3/user?userFields=stats')

  return {
    health: user.data.stats.hp,
    gold: user.data.stats.gp,
    mana: user.data.stats.mp
  }
}

function call(method, url) {
  const options = {
    'method' : method,
    'headers' : {
      'x-api-user' : config.user.id, 
      'x-api-key' : config.user.token
    }
  }

  response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response);
}
