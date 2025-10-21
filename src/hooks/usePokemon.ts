import { useState, useEffect } from 'react';
import type { Pokemon } from '@/types/pokemon';
import { 
  getAllPokemon, 
  getPokemonById, 
  getPokemonByName,
  searchPokemon,
  getPokemonByType,
  getPokemonByRegion,
  getLegendaryPokemon,
  getMythicalPokemon,
  getRandomPokemon
} from '@/utils/pokemonData';

/**
 * Hook to get all Pokemon from database
 */
export function useAllPokemon() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const allPokemon = getAllPokemon();
    setPokemon(allPokemon);
    setLoading(false);
  }, []);

  return { pokemon, loading };
}

/**
 * Hook to get a specific Pokemon by ID (supports API fallback)
 */
export function usePokemon(id: number | undefined) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getPokemonById(id)
      .then(data => {
        setPokemon(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return { pokemon, loading, error };
}

/**
 * Hook to search Pokemon
 */
export function useSearchPokemon(query: string) {
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const searchResults = searchPokemon(query);
    setResults(searchResults);
    setLoading(false);
  }, [query]);

  return { results, loading };
}

/**
 * Hook to filter Pokemon by type
 */
export function usePokemonByType(type: string | null) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type) {
      setPokemon([]);
      return;
    }

    setLoading(true);
    const filtered = getPokemonByType(type as any);
    setPokemon(filtered);
    setLoading(false);
  }, [type]);

  return { pokemon, loading };
}

/**
 * Hook to get legendary/mythical Pokemon
 */
export function useSpecialPokemon(type: 'legendary' | 'mythical') {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const special = type === 'legendary' 
      ? getLegendaryPokemon()
      : getMythicalPokemon();
    setPokemon(special);
    setLoading(false);
  }, [type]);

  return { pokemon, loading };
}

/**
 * Hook to get a random Pokemon
 */
export function useRandomPokemon() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRandom = () => {
    setLoading(true);
    const randomPokemon = getRandomPokemon();
    setPokemon(randomPokemon);
    setLoading(false);
  };

  return { pokemon, loading, generateRandom };
}
