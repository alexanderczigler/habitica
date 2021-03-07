var config = {
  health: {
    threshold: 45
  },
  gold: {
    threshold: 25
  },
  mana: {
    threshold: 25
  },
  user: {
    id: "your-user-id",
    token: "your-api-token"
  },
}

function healthPotion() {
  var user = getUser()

  Logger.log('Health is at ' + user.health)
  Logger.log('Gold is at ' + user.gold)
  Logger.log('Mana is at ' + user.mana)

  if (user.health > config.health.threshold) {
    Logger.log('Health is good')
    return
  }

  if (user.mana > config.mana.threshold) {
    Logger.log('There is enough mana to cast Bless instead')
    return
  }

  if (user.gold < config.gold.threshold) {
    Logger.log('There is too little gold for buying a health potion')
    return
  }

  Logger.log('Buying a health potion')
  call("post", "https://habitica.com/api/v3/user/buy-health-potion" )
}

/*
 * Helpers.
 */

function getUser() {
  var user = call("get", "https://habitica.com/api/v3/user?userFields=stats")

  return {
    health: user.data.stats.hp,
    gold: user.data.stats.gp,
    mana: user.data.stats.mp
  }
}

function call(method, url) {
  var params = {
    "method" : method,
    "headers" : {
      "x-api-user" : config.user.id, 
      "x-api-key" : config.user.token
    }
  }

  response = UrlFetchApp.fetch(url, params);
  var result = JSON.parse(response);

  return result
}
