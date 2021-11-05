/*
 * Accept active quest invitation.
 */
function acceptQuestInvitation(config) {
  makeApiRequest('POST', 'v3/groups/party/quests/accept', config)
}

/*
 * Buy enchanted armoire.
 */
function buyArmoire(config) {
  makeApiRequest('POST', 'v3/user/buy-armoire', config)
}

/*
 * Buy a health potion.
 */
function buyHealthPotion(config) {
  makeApiRequest('POST', 'v3/user/buy-health-potion', config)
}

/*
 * Cast a spell.
 */
function castSpell(spellName, config) {
  makeApiRequest('POST', `v3/user/class/cast/${spellName}`, config)
}

/*
 * Force-start quest.
 */
function forceStartQuest(config) {
  makeApiRequest('POST', 'v3/groups/party/quests/force-start', config)
}

/*
 * Get member.
 */
function getMember(memberId, config) {
  const { data } = makeApiRequest('GET', `v3/members/${memberId}`, config)
  return data
}

/*
 * Get current user's party.
 */
function getParty(config) {
  const { data } = makeApiRequest('GET', 'v3/groups/party', config)
  return data
}

/*
 * Get current user's information.
 */
function getUser(config) {
  const user = makeApiRequest('GET', 'v3/user?userFields=stats', config)

  return {
    gold: user.data.stats.gp,
    health: user.data.stats.hp,
    mana: user.data.stats.mp
  }
}

/*
 * Update party.
 */
function updateParty(party, config) {
  makeApiRequest('PUT', `v3/groups/${party.id}`, config, party)
}

/*
 * Call the Habitica API.
 */

const BASE_URL = 'https://habitica.com/api/'

function makeApiRequest(method, path, config, payload) {
  const options = {
    method : method,
    headers : {
      'x-api-user' : config.userSettings.userId, 
      'x-api-key' : config.userSettings.apiToken,
    },
  }

  if (!!payload) {
    options.contentType = 'application/json'
    options.payload = JSON.stringify(payload)
  }

  const url = `${BASE_URL}${path}`
  try {
    const response = UrlFetchApp.fetch(url, options)
    return JSON.parse(response)
  } catch (error) {
    console.error('Something went wrong with the request to', url)

    throw error
  }
}
