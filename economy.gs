var config = {
  armoire: {
    threshold: 500 // Buy an Enchanted Armoire if there at least this much gold.
  },
  user: {
    id: "your-user-id",
    token: "your-api-token"
  },
}

function armoire() {
  var user = getUser()

  Logger.log('Wallet contains ' + user.gold + ' coins')

  if (user.gold > config.armoire.threshold) {
    var result = call("post", "https://habitica.com/api/v3/user/buy-armoire")

    if (result.data.armoire.type == 'food') {
       Logger.log("You gained " + result.data.armoire.dropText + ".")
     } else {
       Logger.log("You gained " + result.data.armoire.value + " " + result.data.armoire.type + ".")    
     }
  }
}

/*
 * Helpers.
 */

function getUser() {
  var user = call("get", "https://habitica.com/api/v3/user?userFields=stats")

  return {
    gold: user.data.stats.gp,
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
