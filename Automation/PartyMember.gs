function autoJoinQuest() {
  const { quest } = HabiticaApiClient.getParty(CONFIG)

  if (!quest.key) {
    Logger.log('No quest found.')
    return
  }

  if (quest.active) {
    Logger.log('Quest is already active.')
    return
  }

  if (!!quest.members[CONFIG.userSettings.userId]) {
    Logger.log('You are already on this quest.')
    return
  }

  HabiticaApiClient.acceptQuestInvitation(CONFIG)
}
