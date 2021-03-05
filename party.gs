const properties = PropertiesService.getScriptProperties()

var config = {
  quest: {
    gracePeriod: 12 // Hours.
  },
  user: {
    id: 'your-user-id',
    token: 'your-api-token'
  },
}

function join() {
  const { data: { quest } } = getParty()

  if (!quest.key) {
    Logger.log('No quest found')
    return
  }

  if (quest.active) {
    Logger.log('Quest is already active')
    return
  }

  if (!!quest.members[config.user.id]) {
    Logger.log('You are already on this quest')
    return
  }

  call('post', 'https://habitica.com/api/v3/groups/party/quests/accept')
}

function start() {
  var party = getParty()

  if (!party.data.quest.key || party.data.quest.active) {
    Logger.log('There is no pending quest at the moment')

    properties.deleteProperty('invitation')
    
    return
  }

  if (!!properties.getProperty('invitation')) {
    let diff = new Date() - Date.parse(properties.getProperty('invitation'))

    if (diff > config.quest.gracePeriod * 3600000) {
      Logger.log('Starting quest...')

      call('post', 'https://habitica.com/api/v3/groups/party/quests/force-start')
      properties.deleteProperty('invitation')
    }

    return
  }

  Logger.log('There is a new invitation, saving current time')
  properties.setProperty('invitation', new Date())
}

/*
 * Helpers.
 */

function getParty() {
  return call('get', 'https://habitica.com/api/v3/groups/party')
}

function call(method, url) {
  var params = {
    'method' : method,
    'headers' : {
      'x-api-user' : config.user.id, 
      'x-api-key' : config.user.token
    }
  }

  response = UrlFetchApp.fetch(url, params);
  var result = JSON.parse(response);

  return result
}
