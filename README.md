# Habitica Automation Scripts

Here you'll find a few scripts that you can use to automate certain things in Habitica. They are inspired by some ideas posted on the [Habitica Wiki](https://habitica.fandom.com/wiki/Google_Apps_Script). All of the scripts utilise the official [Habitica API](https://habitica.com/apidoc/).

## Why?

I started writing scripts for Habitica as my party grew large. Managing quests, heals and buffs started taking focus away from habit tracking and the social aspects of Habitica, so I had a look at the API and I started writing scripts to automate certain things.

The result of this work is my suite of scripts that anyone can deploy in [Google Apps Script](https://script.google.com) in a matter of minutes to make their own Habitica experience and party management a lot more fun.

You can use my scripts to get the following features:
- Active member tracking in party description
- Automatic tracking of whose turn it is to start a quest
- Automatic starting of pending quests after a configurable amount of time
- Automatic acceptance of quest invitation
- Automatic heals + buffs for healers
- Automatic purchase of Enchanted Armoire
- Automatic purchase of health potion when health is low

## How does it work?

First of all, you will need a Google account to utilise my scripts as they are. If you are familiar with javascript you can easily adapt them to function with nodejs or in a browser context but I will not go into how to do that here.

### Setting up the API client script

I like to keep the API client script separate in case there is a need to share it among more than one accounts. So let's set it up first.

1. Go to [Google Apps Script](https://script.google.com) and select "New project".
2. Name the project `HabiticaApiClient` by clicking and editing "Untitled project" at the top of the page.
3. In the code editor you see a `function myFunction () { }`, remove everything so that the file is empty.
4. Copy the entire contents of the file [HabiticaApiClient.gs](https://github.com/alexanderczigler/habitica/blob/main/HabiticaApiClient.gs) here and paste into the code editor.
5. Save the script.
6. Click the "Project Settings" (cog icon) to the left and look for the "IDs" section,
7. Copy the "Script ID" that you see, save this code somewhere for the time being.

### Setting up the automation scripts

Now you are done setting up the API client. The next step is to set up your configuration file and then one or more scripts that automate things.

#### Configuration

Now it is time to setup a new project for your automation scripts. If you want to use this for more than one account, you can repeat this and the following steps for each account. Your result would be one separate project per Habitica account.

1. Go to [Google Apps Script](https://script.google.com) and select "New project".
2. Name the project `Habtica` (or something fitting) by clicking and editing "Untitled project" at the top of the page.
3. Click the "+"-sign next to the "Libraries"-section to the left.
4. Paste the "Script ID" that you copied earlier (from the `HabiticaApiClient` project).
5. Click "Look up" and make sure to name it "HabiticaApiClient" before you add it.

Now you have the API client referenced so that it is ready to be used by the automation scripts. All of the automation scripts use a shared configuration file, `Config.gs`, where your personal settings are stored. So let's set it up now.

1. In the code editor you see a `function myFunction () { }`, remove everything so that the file is empty.
2. Hover your mouse over the "Code.gs" file to the left, click the three dots-menu that appear and select "Rename".
3. Name the file "Config.gs".
4. Open your [Habitica API settings](https://habitica.com/user/settings/api)
5. On that page you can find your `User ID` and `API Token`.
6. Copy and paste those values into the "Config.gs" file in Google Apps Script.

At this point, your script is configured to use your Habitica account. Now it is time to add the automation scripts of your choise.

#### Automation scripts

##### Economy

1. Create a new file by clicking the "+"-sign near the "Files"-section to the left.
2. Name the file "Economy" and remove the contents of the file.
3. Copy the contents of the file [Economy.gs](https://github.com/alexanderczigler/habitica/blob/main/Economy.gs) into the empty file in Google Apps Script.
4. Save the file and click "Run" at the top of the script.
5. You may now be prompted to authorize the project, if so click "Review permissions" and authorize the project in the popup window.
7. Click "Triggers" (the alarm clock) button in the left-hand menu.
8. Click the "Add Trigger" button.
9. Under "Choose which function to run" select `armoire`.
10. Under "Select type of time based trigger" select "Hour timer".
11. Under "Select hour interval" select "Every hour".
12. Click "Save".

When your level in Habitica is in the hundreds, gold starts accumulating in your account and I noticed that I basically only use it for buying Enchanted Armoires. This script will buy one for you while keeping some spare change around for the occasional Health Potion.

#### Using

1. Adjust the `config` object at the top of the script.
2. Schedule the `armoire()` function to run 2-4 times a day.

### Healer | [healer.gs](https://github.com/alexanderczigler/habitica/blob/main/economy.gs)

After expanding my party I realized that the members are spread across the world and their crons can run just about any time of the day. This makes it difficult for healers like myself to keep up and be able to rush in and heal the party if and when a boss deals a significant amount of damage. This scripts uses my own health to try and figure out when to bast Blessing. Additionally, it will also cast Protective Aura to buff the party on a regular interval.

#### Using

1. Adjust the `config` object at the top of the script.
2. Schedule the `aura()` function to run 2-5 times a day.
3. Schedule the `bless()` function to run 4-8 times an hour.

### Health | [health.gs](https://github.com/alexanderczigler/habitica/blob/main/economy.gs)

If your party is on a very mean boss and your healers are out of mana, you may need to rely on health potions to stay alive. This script will check your health, gold and mana to determine whether to buy a potion or not.

#### Using

1. Adjust `config` in the top of the script to suit your needs.
2. Schedule `healthPotion()` to run relatively often, I recommend 4-8 times an hour depending on the size of your party.

### Party | [party.gs](https://github.com/alexanderczigler/habitica/blob/main/economy.gs)

The party script can help you ensure to never miss a quest invitaiton again. In addition to that, if you are the party leader, it can help you auto-start quests after a certain time. This helps keeping the questing pace up.

- **join()** will check if there is any invitation and join the quest
- **start()** will check if a quest invitation has been open for more than X hours and then start it

#### Using

1. Adjust `config` in the top of the script to suit your needs.
2. Schedule the `join()` function to run every hour.
3. _(If you are the party leader)_ Schedule the `start()` function to run every hour.

## Installing

1. Go to script.google.com
2. Create a new project
3. Copy the contents of a script here, for example healer.gs
4. Paste the contents into the empty script editor, replacing any existing contents there
5. Edit the config object at the top of the file to suit your needs (you can find your user id and api token under Settings in Habitica)
6. Run each function manually to test
7. Create a new schedule for every function you wish to automate
