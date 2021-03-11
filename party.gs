const properties = PropertiesService.getScriptProperties()

const config = {
  party: {
    description: {
      ingress: '',
      title: 'Welcome to **The Party!**',
    },
    members: {
      active: [],
      inactive: []
    },
  },
  quest: {
    gracePeriod: 12 // Hours.
  },
  user: {
    id: 'your-user-id',
    token: 'your-api-token'
  },
}

function description() {
  const party = getParty()

  let description = ''
  description += `# ${config.party.description.title}\n\n`
  description += `${config.party.description.ingress}\n\n`

  if (!!party.quest) {
    let leader = getMember(party.quest.leader)

    if (!!leader) {
      description += `:game_die: Current quest leader is **${leader.profile.name}**\n\n`
      properties.setProperty('lastQuestLeader', leader.profile.name)
    }
  } else {
    if (!!properties.getProperty('lastQuestLeader')) {
      const lastQuestLeader = properties.getProperty('lastQuestLeader')
      description += `There is no active quest. The next person to invite is whomever comes after **${lastQuestLeader}**`
    }
  }

  description += '## Active questing members\n\n'

  config.party.members.active = sort(config.party.members.active)
  config.party.members.active.forEach(member => {
    description += `- ${member}\n`
  })

  description += '## Inactive members\n\n'

  config.party.members.inactive = sort(config.party.members.inactive)
  config.party.members.inactive.forEach(member => {
    description += `- ${member}\n`
  })

  updateParty({id: party.id, description: description})
}

function join() {
  const { quest } = getParty()

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
  const party = getParty()

  if (!party.quest.key || party.quest.active) {
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

function getMember(memberId) {
  const member = call('get', 'https://habitica.com/api/v3/members/' + memberId)

  return member.data
}

function getParty() {
  const party = call('get', 'https://habitica.com/api/v3/groups/party')

  return party.data
}

function updateParty(party) {
  call('put', `https://habitica.com/api/v3/groups/${party.id}`, party)
}

function call(method, url, payload) {
  const options = {
    'method' : method,
    'headers' : {
      'x-api-user' : config.user.id, 
      'x-api-key' : config.user.token
    }
  }

  if (!!payload) {
    options.contentType = 'application/json'
    options.payload = JSON.stringify(payload)
  }

  response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response);
}

/*
 * Case-insensitive sorting
 * From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */
function sort(array) {
  array = array.sort((a, b) => {
    const nameA = a.toUpperCase() // ignore upper and lowercase
    const nameB = b.toUpperCase() // ignore upper and lowercase
    
    if (nameA < nameB) {
      return -1
    }
    
    if (nameA > nameB) {
      return 1
    }

    // names must be equal
    return 0
  })

  return array
}
