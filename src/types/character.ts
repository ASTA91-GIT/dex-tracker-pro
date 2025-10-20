export interface CharacterImage {
  type: 'official_portrait' | 'anime_screenshot' | 'game_art' | 'promotional';
  filename: string;
  source: string;
  license?: string;
  capture_date?: string;
  resolution: string;
  season?: string;
  region?: string;
  verified: boolean;
}

export interface CharacterTeamMember {
  pokemon_name: string;
  pokemon_id: number;
  sprite_url?: string;
  is_signature: boolean;
}

export interface Character {
  character: string;
  slug: string;
  region: string;
  role: string;
  series: string;
  images: CharacterImage[];
  team: CharacterTeamMember[];
  canonical_image_source?: string;
  notes?: string;
}

export interface CharacterManifest {
  version: string;
  last_updated: string;
  characters: Character[];
  qa_report?: {
    missing_canonical_art: string[];
    low_confidence_images: string[];
    pending_verification: string[];
  };
}
