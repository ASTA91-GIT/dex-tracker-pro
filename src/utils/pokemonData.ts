import pokemonDatabase from '@/data/pokemon.json';
import evolutionDatabase from '@/data/evolutions.json';
import megaEvolutionDatabase from '@/data/mega-evolutions.json';
import type { 
  Pokemon, 
  PokemonDatabase, 
  EvolutionChain, 
  MegaEvolution,
  PokemonType 
} from '@/types/pokemon';

// Cache for API-fetched Pokémon
const apiCache = new Map<number, Pokemon>();

/**
 * Get Pokemon by ID from local database or API
 */
export async function getPokemonById(id: number): Promise<Pokemon | null> {
  // Check local database first
  const localPokemon = pokemonDatabase.pokemon.find(p => p.id === id);
  if (localPokemon) {
    return localPokemon as Pokemon;
  }

  // Check cache
  if (apiCache.has(id)) {
    return apiCache.get(id)!;
  }

  // Fetch from API as fallback
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    
    const pokemon: Pokemon = {
      id: data.id,
      name: data.name,
      types: data.types.map((t: any) => t.type.name) as PokemonType[],
      region: getRegionFromGeneration(speciesData.generation.name),
      generation: parseInt(speciesData.generation.url.split('/').slice(-2, -1)[0]),
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
        total: data.stats.reduce((sum: number, s: any) => sum + s.base_stat, 0)
      },
      abilities: data.abilities.map((a: any) => ({
        name: a.ability.name,
        isHidden: a.is_hidden
      })),
      height: data.height / 10,
      weight: data.weight / 10,
      description: getEnglishDescription(speciesData.flavor_text_entries),
      category: getEnglishGenus(speciesData.genera),
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      shinyImage: data.sprites.other['official-artwork'].front_shiny,
      isLegendary: speciesData.is_legendary,
      isMythical: speciesData.is_mythical,
      isMega: false,
      canMegaEvolve: false
    };

    apiCache.set(id, pokemon);
    return pokemon;
  } catch (error) {
    console.error(`Failed to fetch Pokemon ${id}:`, error);
    return null;
  }
}

/**
 * Get all Pokemon (from local database)
 */
export function getAllPokemon(): Pokemon[] {
  return pokemonDatabase.pokemon as Pokemon[];
}

/**
 * Get Pokemon by name
 */
export async function getPokemonByName(name: string): Promise<Pokemon | null> {
  const localPokemon = pokemonDatabase.pokemon.find(
    p => p.name.toLowerCase() === name.toLowerCase()
  );
  
  if (localPokemon) {
    return localPokemon as Pokemon;
  }

  // Try fetching from API
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return getPokemonById(data.id);
  } catch (error) {
    return null;
  }
}

/**
 * Search Pokemon by various criteria
 */
export function searchPokemon(query: string): Pokemon[] {
  const lowerQuery = query.toLowerCase();
  return pokemonDatabase.pokemon.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.types.some(t => t.toLowerCase().includes(lowerQuery)) ||
    p.category.toLowerCase().includes(lowerQuery)
  ) as Pokemon[];
}

/**
 * Get Pokemon by type
 */
export function getPokemonByType(type: PokemonType): Pokemon[] {
  return pokemonDatabase.pokemon.filter(p => 
    p.types.includes(type)
  ) as Pokemon[];
}

/**
 * Get Pokemon by region
 */
export function getPokemonByRegion(region: string): Pokemon[] {
  return pokemonDatabase.pokemon.filter(p => 
    p.region === region
  ) as Pokemon[];
}

/**
 * Get legendary Pokemon
 */
export function getLegendaryPokemon(): Pokemon[] {
  return pokemonDatabase.pokemon.filter(p => p.isLegendary) as Pokemon[];
}

/**
 * Get mythical Pokemon
 */
export function getMythicalPokemon(): Pokemon[] {
  return pokemonDatabase.pokemon.filter(p => p.isMythical) as Pokemon[];
}

/**
 * Get evolution chain for a Pokemon
 */
export function getEvolutionChain(pokemonId: number): EvolutionChain | null {
  return (evolutionDatabase.chains.find(c => c.species === pokemonId) as EvolutionChain) || null;
}

/**
 * Get all evolutions for a Pokemon (recursive)
 */
export function getFullEvolutionLine(pokemonId: number): number[] {
  const line: number[] = [];
  
  // Find the base form
  let currentId = pokemonId;
  const pokemon = pokemonDatabase.pokemon.find(p => p.id === currentId);
  
  if (!pokemon) return [pokemonId];
  
  // Go back to find pre-evolution
  while (pokemon.evolvesFromId) {
    line.unshift(pokemon.evolvesFromId);
    const prevPokemon = pokemonDatabase.pokemon.find(p => p.id === pokemon.evolvesFromId);
    if (!prevPokemon || !prevPokemon.evolvesFromId) break;
  }
  
  // Add current
  line.push(currentId);
  
  // Add evolutions
  if (pokemon.evolvesToIds) {
    line.push(...pokemon.evolvesToIds);
  }
  
  return line;
}

/**
 * Get mega evolution data for a Pokemon
 */
export function getMegaEvolution(pokemonId: number): MegaEvolution[] {
  return megaEvolutionDatabase.megaEvolutions.filter(
    m => m.basePokemonId === pokemonId
  ) as MegaEvolution[];
}

/**
 * Check if Pokemon can mega evolve
 */
export function canMegaEvolve(pokemonId: number): boolean {
  const pokemon = pokemonDatabase.pokemon.find(p => p.id === pokemonId);
  return pokemon?.canMegaEvolve || false;
}

/**
 * Get Pokemon's mega form IDs
 */
export function getMegaFormIds(pokemonId: number): number[] {
  const pokemon = pokemonDatabase.pokemon.find(p => p.id === pokemonId);
  return pokemon?.megaFormIds || [];
}

// Helper functions

function getRegionFromGeneration(generationName: string): any {
  const regionMap: Record<string, string> = {
    'generation-i': 'kanto',
    'generation-ii': 'johto',
    'generation-iii': 'hoenn',
    'generation-iv': 'sinnoh',
    'generation-v': 'unova',
    'generation-vi': 'kalos',
    'generation-vii': 'alola',
    'generation-viii': 'galar',
    'generation-ix': 'paldea'
  };
  return regionMap[generationName] || 'kanto';
}

function getEnglishDescription(entries: any[]): string {
  const entry = entries.find(e => e.language.name === 'en');
  return entry ? entry.flavor_text.replace(/\f/g, ' ') : '';
}

function getEnglishGenus(genera: any[]): string {
  const genus = genera.find(g => g.language.name === 'en');
  return genus ? genus.genus : 'Unknown Pokémon';
}

/**
 * Get random Pokemon
 */
export function getRandomPokemon(): Pokemon {
  const pokemon = pokemonDatabase.pokemon;
  return pokemon[Math.floor(Math.random() * pokemon.length)] as Pokemon;
}

/**
 * Get Pokemon count
 */
export function getPokemonCount(): number {
  return pokemonDatabase.totalPokemon;
}
