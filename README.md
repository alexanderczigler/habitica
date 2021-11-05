# Habitica Automation Scripts

Here you'll find a few scripts that you can use to automate certain things in Habitica. They are inspired by some ideas posted on the [Habitica Wiki](https://habitica.fandom.com/wiki/Google_Apps_Script). All of the scripts utilise the official [Habitica API](https://habitica.com/apidoc/).

## Why?

I started writing scripts for Habitica as my party grew large. Managing quests, heals and buffs started taking focus away from habit tracking and the social aspects of Habitica, so I had a look at the API and I started writing scripts to automate certain things.

The result of this work is my suite of scripts that anyone can deploy in a matter of minutes to make their own Habitica experience and party management a lot more fun!

## What can be automated?

My scripts currently have the following features. The scripts are modular and the Habitica API is well-documented, so you can easily add more functionality to suit your own needs.

- Active member tracking in party description
- Automatic tracking of whose turn it is to start a quest
- Automatic starting of pending quests after a configurable amount of time
- Automatic acceptance of quest invitation
- Automatic heals + buffs for healers
- Automatic purchase of Enchanted Armoire
- Automatic purchase of health potion when health is low

## How does it work?

First of all, you will need a Google account to utilise my scripts as they are. If you are familiar with javascript you can easily adapt them to run in a browser context or nodejs.

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
3. Click the `+`-sign next to the "Libraries"-section to the left.
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

Pick a script in the [Automation](https://github.com/alexanderczigler/habitica/blob/main/Automation) folder. (See the section below to learn more about each script.)

1. Create a new file in your Google Apps Script project by clicking the `+`-sign near the "Files"-section to the left.
2. Name the file to match the script your picked above and remove the `myFunction` that Google generated.

Repeat the steps for every script you would like to use, so that you have one file in your Google Apps Script project for each automation script.

**NOTE** The first time you do this in a project, you need to run the script once to authorize it to make requests to the Habitica API.
1. Save the file and click "Run" at the top of the script.
2. You should now be prompted to authorize the project, if so click "Review permissions" and authorize the project in the popup window.

#### Adding a trigger

The triggers are what actually run the automation scripts. You need to create one trigger for every function, like casting a particular spell. This means you can customize the frequency at which each of the functions are run! (See the section below to learn about 

1. Click "Triggers" (the alarm clock) button in the left-hand menu.
2. Click the "Add Trigger" button.
3. Under "Choose which function to run" select a function (see the section below to know which one to pick).
4. Under "Select type of time based trigger" select `Hour timer` or `Minute timer`.
5. Under "Select ... interval" select desired interval.
6. Click "Save".

## What does each script do?

When your level in Habitica is in the hundreds, gold starts accumulating in your account and I noticed that I basically only use it for buying Enchanted Armoires. This script will buy one for you while keeping some spare change around for the occasional Health Potion.

### [Economy.gs](https://github.com/alexanderczigler/habitica/blob/main/Automation/Economy.gs)

- The `armoire()` function will buy one Enchanted Armoire. I recommend this function for players about lvl 100 or so as it is my experience that you will have a lot of disposible gold around then. Recommended trigger: `Hour timer`, `Every 2 hours`.

### [Healer.gs](https://github.com/alexanderczigler/habitica/blob/main/Automation/Healer.gs)

- The `aura()` function will cast Protective Aura if you have enough mana. Recommended trigger: `Hour timer`, `Every 6 hours`.
- The `bless()` function will cast Blessing if you are below 45 health. Recommended trigger: `Minute timer`, `Every 10 minutes`.

See the Config to change the health and mana thresholds of these functions.

### [HealthPotion.gs](https://github.com/alexanderczigler/habitica/blob/main/Automation/HealthPotion.gs)

- The `healthPotion()` function will buy a health potion if you are below 45 health. Recommended trigger: `Minute timer`, `Every 10 minutes`.

If you are a healer, this function will only buy a potion if you have too little mana to cast Blessing. See the Config to change the health and mana thresholds of this function.

### [PartyLeader.gs](https://github.com/alexanderczigler/habitica/blob/main/Automation/PartyLeader.gs)

TODO: Document.

### [PartyMember.gs](https://github.com/alexanderczigler/habitica/blob/main/Automation/PartyMember.gs)

TODO: Document.
