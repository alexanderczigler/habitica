const config = {
  aura: {
    cost: 30,
    threshold: 125 // Cast Protective Aura when mana is above this.
  },
  bless: {
    cost: 25,
    threshold: 45 // Cast Blessing when health is below this.
  },
  user: {
    id: 'your-user-id',
    token: 'your-api-token'
  },
}

function aura() {
  const { mana } = getUser()

  Logger.log(`You have ${Math.floor(mana)} mana`)

  if (mana < config.aura.cost) {
    Logger.log('You do not have enough mana to cast Protective Aura')
    return
  }

  if (mana > config.aura.threshold) {
    Logger.log('Casting Protective Aura');
    call('post', 'https://habitica.com/api/v3/user/class/cast/protectAura' )
  }
}

function bless() {
  const { health, mana } = getUser()

  Logger.log(`You have ${Math.floor(health)} health points`)

  if (mana < config.bless.cost) {
    Logger.log('You do not have enough mana to cast Blessing')
    return
  }

  if (health < config.bless.threshold) {
    Logger.log('Health is low, casting Blessing');
    call('post', 'https://habitica.com/api/v3/user/class/cast/healAll');
  }
}

/*
 * Helpers.
 */

function getUser() {
  const user = call('get', 'https://habitica.com/api/v3/user?userFields=stats')

  return {
    health: user.data.stats.hp,
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
