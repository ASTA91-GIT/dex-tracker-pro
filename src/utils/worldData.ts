import regionsData from '@/data/regions.json';
import professorsData from '@/data/professors.json';
import gymLeadersData from '@/data/gym-leaders.json';
import { PokemonRegion } from '@/types/pokemon';

export interface Region {
  id: string;
  name: string;
  generation: number;
  description: string;
  professor: string;
  starterPokemon: number[];
  nativePokemonRange: [number, number];
  gymLeaders: GymLeaderInfo[];
  eliteFour: string[];
  champion: string;
  islandKahunas?: IslandKahuna[];
}

export interface GymLeaderInfo {
  name: string;
  city: string;
  type: string;
  badge: string;
}

export interface IslandKahuna {
  name: string;
  island: string;
  type: string;
}

export interface Professor {
  id: string;
  name: string;
  fullName: string;
  region: string;
  generation: number;
  specialty: string;
  description: string;
  starterPokemon: string[];
  lab: string;
  famousFor: string;
  appearance: {
    hairColor: string;
    outfit: string;
  };
}

export interface GymLeader {
  id: string;
  name: string;
  region: string;
  city?: string;
  type: string;
  badge?: string;
  generation: number;
  team: {
    pokemon_id: number;
    pokemon_name: string;
    level: number;
    is_signature?: boolean;
    canGigantamax?: boolean;
  }[];
  description: string;
  specialty: string;
  role?: 'champion' | 'gym_leader' | 'elite_four';
}

// Region utilities
export const getAllRegions = (): Region[] => {
  return regionsData.regions as Region[];
};

export const getRegionById = (regionId: string): Region | undefined => {
  return regionsData.regions.find(r => r.id === regionId) as Region | undefined;
};

export const getRegionByName = (regionName: string): Region | undefined => {
  return regionsData.regions.find(
    r => r.name.toLowerCase() === regionName.toLowerCase()
  ) as Region | undefined;
};

export const getRegionByGeneration = (generation: number): Region | undefined => {
  return regionsData.regions.find(r => r.generation === generation) as Region | undefined;
};

export const getPokemonRegion = (pokemonId: number): Region | undefined => {
  return regionsData.regions.find(r => {
    const [min, max] = r.nativePokemonRange;
    return pokemonId >= min && pokemonId <= max;
  }) as Region | undefined;
};

// Professor utilities
export const getAllProfessors = (): Professor[] => {
  return professorsData.professors as Professor[];
};

export const getProfessorById = (professorId: string): Professor | undefined => {
  return professorsData.professors.find(p => p.id === professorId) as Professor | undefined;
};

export const getProfessorByRegion = (region: string): Professor | undefined => {
  return professorsData.professors.find(
    p => p.region.toLowerCase() === region.toLowerCase()
  ) as Professor | undefined;
};

export const getProfessorByName = (name: string): Professor | undefined => {
  return professorsData.professors.find(
    p => p.name.toLowerCase() === name.toLowerCase()
  ) as Professor | undefined;
};

// Gym Leader utilities
export const getAllGymLeaders = (): GymLeader[] => {
  return gymLeadersData.gymLeaders as GymLeader[];
};

export const getGymLeaderById = (leaderId: string): GymLeader | undefined => {
  return gymLeadersData.gymLeaders.find(l => l.id === leaderId) as GymLeader | undefined;
};

export const getGymLeadersByRegion = (region: string): GymLeader[] => {
  return gymLeadersData.gymLeaders.filter(
    l => l.region.toLowerCase() === region.toLowerCase()
  ) as GymLeader[];
};

export const getChampions = (): GymLeader[] => {
  return gymLeadersData.gymLeaders.filter(
    l => l.role === 'champion'
  ) as GymLeader[];
};

export const getGymLeaderByName = (name: string): GymLeader | undefined => {
  return gymLeadersData.gymLeaders.find(
    l => l.name.toLowerCase() === name.toLowerCase()
  ) as GymLeader | undefined;
};

export const getGymLeadersByType = (type: string): GymLeader[] => {
  return gymLeadersData.gymLeaders.filter(
    l => l.type.toLowerCase() === type.toLowerCase()
  ) as GymLeader[];
};

// Combined utilities
export const getRegionData = (regionId: string) => {
  const region = getRegionById(regionId);
  if (!region) return null;

  const professor = getProfessorByRegion(region.name);
  const gymLeaders = getGymLeadersByRegion(region.id);
  const champion = gymLeaders.find(l => l.role === 'champion');

  return {
    region,
    professor,
    gymLeaders: gymLeaders.filter(l => !l.role || l.role === 'gym_leader'),
    champion,
    eliteFour: region.eliteFour
  };
};

export const getCompleteWorldData = () => {
  return {
    regions: getAllRegions(),
    professors: getAllProfessors(),
    gymLeaders: getAllGymLeaders(),
    champions: getChampions()
  };
};
