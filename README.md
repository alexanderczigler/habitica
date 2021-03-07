# Habitica

Here you'll find a few scripts that you can use to automate certain things in Habitica. They are inspired by some ideas posted on the [Habitica Wiki](https://habitica.fandom.com/wiki/Google_Apps_Script).

## Functions

I have split my scripts into functions so it is easier for you to pick what you want.

### Economy | [economy.gs](https://github.com/alexanderczigler/habitica/blob/main/economy.gs)

When I reached a certain point I realized that gold started accumulating in my account and each time I logged in to Habitica to find I had over a 100 g I would simply purchase an Enchanted Armoire. I want to focus on other things so naturally, I scripted this.

#### Using

1. Adjust the `config` object at the top of the script.
2. Schedule the `armoire()` function to run 2-4 times a day.

### Healer | [healer.gs](https://github.com/alexanderczigler/habitica/blob/main/economy.gs)

After expanding my party I realized that the members are spread across the world and their crons can run just about any time of the day. This makes it difficult for healers like myself to keep up and be able to rush in and heal the party if and when a boss deals a significant amount of damage. The healer script makes sure that everyone gets buffed regularly while preserving some mana for me. In addition, it will periodically look at my health and if it is too low, cast Blessing to heal the party.

- **aura()** Casts Protective Aura if there is enough mana.
- **bless()** Casts Blessing, healing yourself and your party members, if your health is low enough.

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
