export interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Ability {
  name: string;
  description: string;
  damageType?: string;
  minLevel: number;
  maxLevel?: number;
}

export interface Infusion {
  name: string;
  description: string;
  element: InfusionElement;
  blastType?: string;
  burnCost: number;
  minLevel: number;
  maxLevel?: number;
  prerequisites?: string;
  duration?: string;
}

export type InfusionElement =
  | 'fire'
  | 'ice'
  | 'lightning'
  | 'acid'
  | 'poison'
  | 'necrotic'
  | 'radiant'
  | 'force'
  | 'psychic'
  | 'thunder'
  | 'air'
  | 'earth'
  | 'water'
  | 'shadow'
  | 'nature'
  | 'universal';

export interface Subclass {
  id: string;
  name: string;
  description: string;
  abilities: Ability[];
}

export interface DndClass {
  id: string;
  name: string;
  description: string;
  hitDice: number;
  primaryAttribute: keyof Attributes;
  attributes: Attributes;
  abilities: Ability[];
  infusions: Infusion[];
  subclasses: Subclass[];
  armor: string[];
  weapons: string[];
  skills: string[];
  createdAt: number;
  updatedAt: number;
}

export type DieType = 2 | 4 | 6 | 8 | 12 | 20;