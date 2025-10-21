export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export type PokemonRegion = 
  | 'kanto' | 'johto' | 'hoenn' | 'sinnoh' | 'unova' | 'kalos' 
  | 'alola' | 'galar' | 'paldea';

export type EvolutionMethod = 
  | 'level' | 'stone' | 'trade' | 'friendship' | 'location' | 'item' | 'other';

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  region: PokemonRegion;
  generation: number;
  stats: PokemonStats;
  abilities: PokemonAbility[];
  height: number; // in meters
  weight: number; // in kg
  description: string;
  category: string; // e.g., "Seed Pokémon", "Flame Pokémon"
  image: string; // URL to official artwork
  shinyImage?: string;
  isLegendary: boolean;
  isMythical: boolean;
  isMega: boolean;
  canMegaEvolve: boolean;
  megaFormIds?: number[]; // IDs of mega evolution forms
  evolvesFromId?: number;
  evolvesToIds?: number[];
}

export interface EvolutionRequirement {
  method: EvolutionMethod;
  level?: number;
  stone?: string; // e.g., "Fire Stone", "Thunder Stone"
  item?: string;
  friendship?: number;
  location?: string;
  time?: 'day' | 'night';
  gender?: 'male' | 'female';
  move?: string;
  heldItem?: string;
  trade?: boolean;
  notes?: string;
}

export interface EvolutionChain {
  species: number; // Pokemon ID
  evolvesTo: {
    species: number;
    requirement: EvolutionRequirement;
  }[];
}

export interface MegaEvolution {
  basePokemonId: number;
  megaPokemonId: number;
  name: string; // e.g., "Mega Charizard X"
  stone: string; // e.g., "Charizardite X"
  types: PokemonType[];
  ability: string;
  statBoosts: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

export interface PokemonDatabase {
  version: string;
  lastUpdated: string;
  totalPokemon: number;
  pokemon: Pokemon[];
}

export interface EvolutionDatabase {
  version: string;
  lastUpdated: string;
  chains: EvolutionChain[];
}

export interface MegaEvolutionDatabase {
  version: string;
  lastUpdated: string;
  megaEvolutions: MegaEvolution[];
}
