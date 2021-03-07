const config = {
  armoire: {
    threshold: 500 // Buy an Enchanted Armoire if there at least this much gold.
  },
  user: {
    id: 'your-user-id',
    token: 'your-api-token'
  },
}

function armoire() {
  const { gold } = getUser()

  Logger.log(`You have ${Math.floor(gold)} gold`)

  if (gold > config.armoire.threshold) {
    const { data: { armoire } } = call('post', 'https://habitica.com/api/v3/user/buy-armoire')

    if (armoire.type == 'food') {
       Logger.log(`You gained ${armoire.dropText}`)
     } else {
       Logger.log('You gained ' + armoire.value + ' ' + armoire.type + '.')
       Logger.log(`You gained ${armoire.value} ${armoire.type}`)
     }
  }
}

/*
 * Helpers.
 */

function getUser() {
  const user = call('get', 'https://habitica.com/api/v3/user?userFields=stats')

  return {
    gold: user.data.stats.gp,
  }
}

function call(method, url) {
  const params = {
    'method' : method,
    'headers' : {
      'x-api-user' : config.user.id, 
      'x-api-key' : config.user.token
    }
  }

  response = UrlFetchApp.fetch(url, params);
  return JSON.parse(response);
}
