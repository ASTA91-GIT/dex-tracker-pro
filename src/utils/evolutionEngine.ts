import type { Pokemon, EvolutionRequirement, EvolutionChain } from '@/types/pokemon';
import { getEvolutionChain, getPokemonById } from './pokemonData';
import evolutionDatabase from '@/data/evolutions.json';

/**
 * Check if a Pokemon can evolve based on requirements
 */
export function canEvolve(
  pokemon: Pokemon,
  level: number = 1,
  hasStone?: string,
  friendship: number = 0,
  time?: 'day' | 'night',
  location?: string
): boolean {
  const chain = getEvolutionChain(pokemon.id);
  if (!chain || !chain.evolvesTo.length) return false;

  return chain.evolvesTo.some(evolution => 
    meetsRequirement(evolution.requirement, level, hasStone, friendship, time, location)
  );
}

/**
 * Check if evolution requirements are met
 */
export function meetsRequirement(
  requirement: EvolutionRequirement,
  level: number = 1,
  hasStone?: string,
  friendship: number = 0,
  time?: 'day' | 'night',
  location?: string
): boolean {
  switch (requirement.method) {
    case 'level':
      return level >= (requirement.level || 0);
    
    case 'stone':
      return hasStone === requirement.stone;
    
    case 'friendship':
      const friendshipMet = friendship >= (requirement.friendship || 0);
      if (requirement.time) {
        return friendshipMet && time === requirement.time;
      }
      return friendshipMet;
    
    case 'location':
      return location === requirement.location;
    
    case 'trade':
      return requirement.trade === true;
    
    case 'item':
      return hasStone === requirement.item; // Using hasStone param for held items too
    
    default:
      return false;
  }
}

/**
 * Get the next evolution ID if requirements are met
 */
export function getNextEvolution(
  pokemonId: number,
  level: number = 1,
  hasStone?: string,
  friendship: number = 0,
  time?: 'day' | 'night',
  location?: string
): number | null {
  const chain = getEvolutionChain(pokemonId);
  if (!chain) return null;

  const validEvolution = chain.evolvesTo.find(evolution =>
    meetsRequirement(evolution.requirement, level, hasStone, friendship, time, location)
  );

  return validEvolution?.species || null;
}

/**
 * Simulate evolution (returns the evolved Pokemon ID)
 */
export async function evolve(
  pokemonId: number,
  level: number = 1,
  hasStone?: string,
  friendship: number = 0,
  time?: 'day' | 'night',
  location?: string
): Promise<{ success: boolean; evolvedId?: number; message: string }> {
  const nextEvolutionId = getNextEvolution(pokemonId, level, hasStone, friendship, time, location);
  
  if (!nextEvolutionId) {
    return {
      success: false,
      message: 'Evolution requirements not met or Pokemon cannot evolve further.'
    };
  }

  const evolvedPokemon = await getPokemonById(nextEvolutionId);
  if (!evolvedPokemon) {
    return {
      success: false,
      message: 'Failed to load evolved Pokemon data.'
    };
  }

  return {
    success: true,
    evolvedId: nextEvolutionId,
    message: `Evolved into ${evolvedPokemon.name}!`
  };
}

/**
 * Get all possible evolutions for a Pokemon
 */
export function getPossibleEvolutions(pokemonId: number): {
  species: number;
  requirement: EvolutionRequirement;
}[] {
  const chain = getEvolutionChain(pokemonId);
  return chain?.evolvesTo || [];
}

/**
 * Get evolution requirement description
 */
export function getEvolutionDescription(requirement: EvolutionRequirement): string {
  switch (requirement.method) {
    case 'level':
      return `Level ${requirement.level}`;
    
    case 'stone':
      return `Use ${requirement.stone}`;
    
    case 'friendship':
      let desc = `High friendship (${requirement.friendship}+)`;
      if (requirement.time) {
        desc += ` during ${requirement.time}`;
      }
      return desc;
    
    case 'location':
      return `Level up at ${requirement.location}`;
    
    case 'trade':
      let tradeDesc = 'Trade';
      if (requirement.item) {
        tradeDesc += ` while holding ${requirement.item}`;
      }
      return tradeDesc;
    
    case 'item':
      return `Use ${requirement.item}`;
    
    case 'other':
      return requirement.notes || 'Special evolution method';
    
    default:
      return 'Unknown requirement';
  }
}

/**
 * Get evolution stones list
 */
export const EVOLUTION_STONES = [
  'Fire Stone',
  'Water Stone',
  'Thunder Stone',
  'Leaf Stone',
  'Moon Stone',
  'Sun Stone',
  'Shiny Stone',
  'Dusk Stone',
  'Dawn Stone',
  'Ice Stone'
] as const;

/**
 * Get all Pokemon that evolve with a specific stone
 */
export function getPokemonByStone(stone: string): number[] {
  const pokemonIds: number[] = [];
  
  evolutionDatabase.chains.forEach(chain => {
    chain.evolvesTo.forEach(evolution => {
      if (evolution.requirement.method === 'stone' && evolution.requirement.stone === stone) {
        pokemonIds.push(chain.species);
      }
    });
  });
  
  return pokemonIds;
}

/**
 * Calculate evolution progress percentage
 */
export function getEvolutionProgress(
  pokemonId: number,
  currentLevel: number,
  currentFriendship: number = 0
): number {
  const chain = getEvolutionChain(pokemonId);
  if (!chain || !chain.evolvesTo.length) return 100; // Already fully evolved

  const evolution = chain.evolvesTo[0]; // Get first evolution option
  const requirement = evolution.requirement;

  switch (requirement.method) {
    case 'level':
      const requiredLevel = requirement.level || 1;
      return Math.min((currentLevel / requiredLevel) * 100, 100);
    
    case 'friendship':
      const requiredFriendship = requirement.friendship || 220;
      return Math.min((currentFriendship / requiredFriendship) * 100, 100);
    
    case 'stone':
    case 'trade':
    case 'location':
    case 'item':
      return 0; // These are instant when conditions are met
    
    default:
      return 0;
  }
}
