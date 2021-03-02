# Habitica

Here you'll find a few scripts that you can use to automate certain things in Habitica. They are inspired by some ideas posted on the [Habitica Wiki](https://habitica.fandom.com/wiki/Google_Apps_Script).

## Healer | healer.gs

After expanding my party I realized that the members are spread across the world and their crons can run just about any time of the day. This makes it difficult for healers like myself to keep up and be able to rush in and heal the party if and when a boss deals a significant amount of damage. The healer script makes sure that everyone gets buffed regularly while preserving some mana for me. In addition, it will periodically look at my health and if it is too low, cast Blessing to heal the party.

Check the `config` object at the top and change the values accordingly. Then create a schedule that runs `aura()` and `bless()` regularly. My suggestion is to set `aura()` to run 2-4 times a day and `bless()` to run often, perhaps 4-8 times an hour.
