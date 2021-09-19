const properties = PropertiesService.getScriptProperties()

const config = {
  quest: {
    gracePeriod: 12 // Hours.
  },
  user: {
    id: '',
    token: ''
  },
}

const Description = function (markdown) {
  this.markdown = markdown ?? ''
}

Description.prototype.write = function (line) {
  this.markdown += ` ${line ?? ''}`
}

Description.prototype.writeLine = function (line) {
  this.write(`${line ?? ''}\n\n`)
}

function description() {
  const party = getParty()

  let description = new Description()

  /*
   * This is where you build your party description.
   * Use description.line() and description.newLine() to add markdown.
   */
  description.writeLine(`# Welcome to **The Party!**`)
  description.write(`Our only rule is that you stay active and pay attention to your dailies while you join a quest.`)
  description.writeLine(`Enjoy your stay and ask your fellow party members if you have any questions about how Habitica works, changing your life or anything inbetween :blush:`)

  /*
   * Write information about the current quest, if any.
   */
  if (!!party.quest && !!party.quest.active) {
    let leader

    if (!!party.quest.leader) {
      leader = getMember(party.quest.leader)
    }

    description.writeLine(`## :game_die: The current quest\n\n`)

    if (!!leader) {
      description.write(`**@${leader.profile.name}** is leading the current quest.`)
      description.writeLine('See the quest details section for more information.')

      description.write(`For those of you who joined this quest, pay extra attention to your dailies.`)
      description.write('Any missed dailies may cause damage to yourself and other members.')
      description.writeLine(`**Remember:** *Consistency is the key to breaking bad habits and forming good ones.*`)
      
      // Save current quest leader so the script remembers it after the quest has ended.
      properties.setProperty('lastQuestLeader', leader.profile.name)
    }
  } else {
    if (!!properties.getProperty('lastQuestLeader')) {
      const lastQuestLeader = properties.getProperty('lastQuestLeader')
      description.writeLine(`There is no active quest. The previous quest was led by **${lastQuestLeader}**.`)
    }
  }

  description.writeLine('## :scroll: Quest invitations')
  description.write('We take turns leading quests according to the order of our names.')
  description.write('Usually someone in the party will mention the person next in line when it is their turn,')
  description.writeLine(`but if that does not happen, alert the party leader **@${party.leader.profile.name}** who will sort it out.`)

  description.writeLine('### :pushpin: Notes on quests')
  description.writeLine(' - Leading quests is optional, just let us know if you want to pass')
  description.writeLine(` - Quests are automatically started around ${config.quest.gracePeriod} hours after the invitation was sent`)
  description.writeLine(' - When it is your turn you are free to pick any quest *you* want to do')

  description.write('As quests are automatically started, it is ok to be offline for a few days without disrupting the party.')
  description.write('We get that everyone has a life outside of Habitica :yellow_heart:')
  description.writeLine('but when you do join a quest, see it as an opportunity to work a little extra hard on your habits!')

  updateParty({id: party.id, description: description.markdown})
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

function appendMarkdown(text) {
  return `${text}\n\n`
}

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
