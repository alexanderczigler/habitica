const properties = PropertiesService.getScriptProperties()

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
  const party = HabiticaApiClient.getParty(CONFIG)

  let description = new Description()

  let leader
  if (!!party.quest && !!party.quest.leader) {
    leader = HabiticaApiClient.getMember(party.quest.leader, CONFIG)
  }

  const questLeaderLink = !!leader ? `[@${leader.profile.name}](https://habitica.com/profile/${party.quest.leader})` : '(unknown)'
  const partyLeaderLink = `[@${party.leader.profile.name}](https://habitica.com/profile/${party.leader.id})`
  const partyMembers = getMembers(party)

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
  description.writeLine(`## 🎲 The current quest\n\n`)

  const inactive = !party.quest || !party.quest.active
  const invitation = !!party.quest && !party.quest.active && !!leader
  const active = !!party.quest && !!party.quest.active

  /* 
  * There is no active quest.
  */
  if (inactive) {
    description.write('There is no active quest.')

    if (!!properties.getProperty('lastQuestLeader')) {
      const lastQuestLeader = properties.getProperty('lastQuestLeader')
      description.writeLine(` The previous quest was led by **${lastQuestLeader}**.`)
    } else {
      description.writeLine('It is unknown who led the previous quest.')
    }
  }

  /*
   * There is a quest invitation.
   */
  if (invitation) {
    description.write(`**${questLeaderLink}** has invited the party on a new quest.`)
    description.writeLine('Make sure you accept the invitation if you intend to join!')
  }

  /*
   * There is an active quest.
   */
  if (active) {
      description.write(`**${questLeaderLink}** is leading the current quest.`)
      description.writeLine('See the quest details section for more information.')

      description.write(`For those of you who joined this quest, pay extra attention to your dailies.`)
      description.write('Any missed dailies may cause damage to yourself and other members.')
      description.writeLine(`**Remember:** *Consistency is the key to breaking bad habits and forming good ones.*`)
      
      // Save current quest leader so the script remembers it after the quest has ended.
      properties.setProperty('lastQuestLeader', leader.profile.name)
  }

  description.writeLine('## 📜 Quest invitations')
  
  description.write('We take turns leading quests according to the order of our names.')
  description.write('If you are after the person with the 🎲 in the list, get ready to send a quest invitation')
  description.writeLine('when the current quest ends. (TIP: Be active in the chat to be counted as active!)')

  description.writeLine(`### **${partyMembers.length}** Active members`)
  partyMembers.forEach(member => {
    let name = member.name

    if (!!leader && leader.profile.name === name) {
      name = `🎲 **${name}**`
    }

    description.writeLine(` - ${name}`)
  })
  
  description.writeLine('### 📌 Notes on quests')
  description.writeLine(' - Leading quests is optional, just let us know if you want to pass')
  description.writeLine(` - Quests are automatically started around ${CONFIG.quest.gracePeriod} hours after the invitation was sent`)
  description.writeLine(' - When it is your turn you are free to pick any quest *you* want to do')

  description.write('As quests are automatically started, it is ok to be offline for a few days without disrupting the party.')
  description.write('We get that everyone has a life outside of Habitica :yellow_heart:')
  description.writeLine('but when you do join a quest, see it as an opportunity to work a little extra hard on your habits!')

  description.writeLine('Have a wonderful day,')
  description.writeLine(`💛 ${partyLeaderLink}`)

  HabiticaApiClient.updateParty({id: party.id, description: description.markdown}, CONFIG)
}

/*
 * Gets a list of members by sifting through the party chat logs.
 */
function getMembers(party) {
  const now = new Date()

  let partyMembers = []

  const userMessages = party.chat

  userMessages.forEach(message => {
    let id, name

    if (!!message.uuid) {
      id = message.uuid
    }

    if (!!message.user) {
      name = message.user
    } else if (!!message.info) {
      name = message.info.user
    }

    if (!name) {
      return
    }

    const exists = partyMembers.filter(m => m.name === name || m.uuid === id).length > 0
    
    if (!exists) {
      partyMembers.push({
        id: id,
        name: name,
        username: message.username,
        updated: now,
      })
    }
  })

  partyMembers = sort(partyMembers)

  return partyMembers
}

function autoStartQuest() {
  const party = HabiticaApiClient.getParty(CONFIG)

  if (!party.quest.key || party.quest.active) {
    Logger.log('There is no pending quest at the moment')

    properties.deleteProperty('invitation')
    
    return
  }

  if (!!properties.getProperty('invitation')) {
    let diff = new Date() - Date.parse(properties.getProperty('invitation'))

    if (diff > CONFIG.quest.gracePeriod * 3600000) {
      Logger.log('Starting quest...')

      HabiticaApiClient.forceStartQuest(CONFIG)
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

/*
 * Case-insensitive sorting
 * From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */
function sort(array) {
  array = array.sort((a, b) => {
    const nameA = a.name.toUpperCase() // ignore upper and lowercase
    const nameB = b.name.toUpperCase() // ignore upper and lowercase
    
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
