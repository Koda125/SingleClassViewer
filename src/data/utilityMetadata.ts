export interface UtilityMetadata {
  minLevel: number;
  burnCost: number;
}

const utilityMetadataEntries: Array<[string, number, number]> = [
  ['Absentia', 10, 0], ['Aerial Adaptation', 3, 0], ['Aerial Evasion', 7, 1], ['Air Cushion', 7, 0],
  ['Air Shroud', 7, 0], ['Air Shroud (Greater)', 10, 0], ['Air Leap', 3, 0], ['Air Reach', 3, 0],
  ['Angelic Protection', 7, 0], ['Basic Aerokinesis', 1, 0], ['Basic Umbrakinesis', 1, 0], ['Basic Geokinesis', 1, 0],
  ['Basic Hydrokinesis', 1, 0], ['Basic Poisonkinesis', 1, 0], ['Basic Pyrokinesis', 1, 0], ['Basic Soulkinesis', 1, 0],
  ['Body of Air', 7, 0], ['Brachiation', 3, 0], ['Celerity', 7, 2], ['Celerity (Greater)', 10, 1],
  ['Clockwork Heart', 7, 0], ['Clockwork Puppetry', 10, 1], ['Cold Adaptation', 3, 0], ['Cold Snap', 3, 1],
  ['Corpse Puppet', 7, 1], ['Corpse Puppet (Greater)', 10, 5], ['Cryokinetic Stasis', 7, 1], ['Curse Breaker', 7, 0],
  ['Dawdled Reaction', 15, 1], ['Domain Realm: Tethers of Earth', 15, 6], ['Earth Child', 3, 0], ['Earth Climb', 3, 0],
  ['Earth Glide', 7, 0], ['Earth Tongue', 10, 2], ['Earth Walk', 3, 0], ['Earthmeld', 7, 1],
  ['Elemental Exile', 7, 4], ['Elemental Exile (Greater)', 15, 1], ['Elemental Grip', 10, 0], ['Elemental Transmission', 10, 0],
  ['Elemental Whispers', 3, 0], ['Elemental Whispers (Greater)', 10, 1], ['Enduring Earth', 7, 0], ['Engulfing Winds', 7, 1],
  ['Expanded Defense', 7, 0], ['Eyes of the Void', 3, 0], ['Fire Corridor', 7, 1], ['Fire Sculptor', 3, 0],
  ['Fire Steed', 7, 0], ["Fire's Fury", 10, 0], ['Fire Sight', 3, 0], ['Flame Jet', 3, 0],
  ['Flame Jet (Greater)', 7, 0], ['Flame Shield', 7, 1], ['Flame Trap', 3, 0], ['Foxfire', 7, 1],
  ['From the Ashes', 15, 4], ['Greater Fire Steed', 10, 0], ['Green Tongue', 7, 0], ['Green Tongue (Greater)', 10, 0],
  ['Greensight', 3, 1], ['Healing Burst', 7, 2], ['Heat Adaptation', 3, 0], ['Heat Wave', 3, 1],
  ['Herbal Anti-venom', 10, 1], ['Hurricane Queen', 15, 0], ['Ice Path', 7, 0], ['Ice Sculptor', 3, 0],
  ['Icewalker', 3, 0], ['Improved Fire Steed', 7, 0], ['Jagged Flesh', 7, 1], ['Kinetic Awe', 2, 0],
  ['Kinetic Cover', 3, 0], ['Kinetic Form', 7, 0], ['Kinetic Healer', 3, 1], ['Kinetic Restoration', 3, 1],
  ['Kinetic Revivification', 10, 4], ['Living Capacitor', 3, 0], ['Magnetism', 7, 2], ['Magnetism (Greater)', 10, 1],
  ['Merciful', 2, 0], ['No Breath', 7, 0], ['Pillar', 7, 0], ['Plant Disguise', 7, 1],
  ['Plant Puppet', 10, 2], ['Primal Light', 15, 0], ['Primal Venom', 15, 0], ['Purging Flames', 15, 1],
  ['Purifying Flames', 3, 1], ['Radiant Rejuvenation', 10, 0], ['Radiant Sight', 3, 0], ['Radiant Step', 7, 2],
  ['Radiant Strike', 7, 2], ['Reverse Shift', 10, 1], ['Ride the Blast', 7, 0], ['Roots', 2, 0],
  ['Searing Flame', 10, 0], ['Seismic Master', 15, 4], ['Shadow Healer', 3, 1], ['Shift Earth', 7, 0],
  ['Shift Earth (Greater)', 10, 1], ['Shimmering Mirage', 7, 1], ['Skilled Kineticist', 2, 0],
  ['Skilled Kineticist (Greater)', 7, 0], ['Skywalk', 10, 1], ['Slick', 2, 0], ['Solar Resurrection', 15, 2],
  ['Spark of Innovation', 7, 0], ['Splash of River Styx', 7, 1], ['Sun Blast', 15, 5], ['Tidal Wave', 15, 4],
  ['Trail of Flames', 10, 1], ['Tree Step', 10, 2], ['Tremorsense', 3, 0], ['Tremorsense (Greater)', 7, 0],
  ['Undead Grip', 3, 0], ['Veil of Mists', 3, 0], ['Venom Speaker', 3, 0], ['Voice of the Wind', 3, 0],
  ['Voice of the Wind (Greater)', 7, 0], ['Water Alteration', 3, 0], ['Water Manipulator', 7, 0], ['Waterdancer', 3, 0],
  ['Waterdancer (Greater)', 7, 0], ['Watersense', 7, 0], ['Watersense (Greater)', 10, 0], ['Weather Master', 15, 0],
  ['Wild Growth', 7, 1], ['Wind Manipulator', 10, 1], ['Windsight', 3, 0], ['Windsight (Greater)', 10, 0],
  ['Wings of Air', 7, 0], ['Vitakinesis', 3, 1],
];

export const utilityMetadata: Record<string, UtilityMetadata> = Object.fromEntries(
  utilityMetadataEntries.map(([name, minLevel, burnCost]) => [name.toLowerCase(), { minLevel, burnCost }])
);
