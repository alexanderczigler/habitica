var config = {
  aura: {
    threshold: 125 // Cast Protective Aura when mana is above this.
  },
  bless: {
    threshold: 45 // Cast Blessing when health is below this.
  },
  user: {
    id: "your-user-id",
    token: "your-api-token"
  },
}

function aura() {
  var user = getUser()

  Logger.log('Mana is at ' + user.mana)

  if (user.mana > config.aura.threshold) {
    call("post", "https://habitica.com/api/v3/user/class/cast/protectAura" )
  }
}

function bless() {
  var user = getUser()

  Logger.log('Health is at ' + user.health);

  if (user.health < config.bless.threshold) {
    Logger.log("Health is low, casting Blessing.");
    call("post", "https://habitica.com/api/v3/user/class/cast/healAll");
  }
}

/*
 * Helpers.
 */

function getUser() {
  var user = call("get", "https://habitica.com/api/v3/user?userFields=stats")

  return {
    health: user.data.stats.hp,
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
