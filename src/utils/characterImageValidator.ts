import { CharacterImage } from '@/types/character';

const OFFICIAL_DOMAINS = [
  'pokemon.com',
  'bulbapedia.bulbagarden.net',
  'serebii.net',
  'pokemondb.net',
  'assets.pokemon.com'
];

export const validateImageSource = (image: CharacterImage): {
  valid: boolean;
  confidence: number;
  issues: string[];
} => {
  const issues: string[] = [];
  let confidence = 100;

  // Check if verified
  if (!image.verified) {
    issues.push('Image not verified as official');
    confidence -= 50;
  }

  // Check source domain
  const isOfficialDomain = OFFICIAL_DOMAINS.some(domain => 
    image.source.toLowerCase().includes(domain)
  );
  
  if (!isOfficialDomain && !image.source.includes('PLACEHOLDER')) {
    issues.push('Source domain not in official whitelist');
    confidence -= 30;
  }

  // Check if placeholder
  if (image.source.includes('PLACEHOLDER')) {
    issues.push('Placeholder image - requires official replacement');
    confidence = 0;
  }

  // Check filename format
  const filenamePattern = /^[a-z_]+_official_[a-z]+\.(png|jpg|jpeg|webp)$/;
  if (!filenamePattern.test(image.filename)) {
    issues.push('Filename does not match canonical format');
    confidence -= 10;
  }

  // Check resolution
  if (image.resolution) {
    const [width, height] = image.resolution.split('x').map(Number);
    if (width < 512 || height < 512) {
      issues.push('Resolution below recommended minimum (512x512)');
      confidence -= 5;
    }
  }

  return {
    valid: confidence >= 95,
    confidence,
    issues
  };
};

export const generateImagePath = (slug: string, imageFilename: string): string => {
  return `/src/assets/characters/${slug}/${imageFilename}`;
};

export const getImageOrFallback = (
  images: CharacterImage[],
  characterName: string
): { 
  useImage: boolean; 
  imagePath?: string; 
  initials: string;
  warning?: string;
} => {
  const initials = characterName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  if (!images || images.length === 0) {
    return {
      useImage: false,
      initials,
      warning: 'No images available'
    };
  }

  // Find first verified official portrait
  const officialPortrait = images.find(
    img => img.type === 'official_portrait' && img.verified
  );

  if (officialPortrait) {
    const validation = validateImageSource(officialPortrait);
    if (validation.valid) {
      return {
        useImage: true,
        imagePath: generateImagePath(
          characterName.toLowerCase().replace(/\s+/g, '_'),
          officialPortrait.filename
        ),
        initials
      };
    }
  }

  // Use placeholder if no valid image
  return {
    useImage: false,
    initials,
    warning: 'Official image pending verification'
  };
};
