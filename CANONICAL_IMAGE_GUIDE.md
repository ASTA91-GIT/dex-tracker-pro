# Canonical Character Image Implementation Guide

## Overview
This guide explains how to properly add official, canonical images for Pokémon anime/game characters to the PokéTrack system.

## Directory Structure
```
src/
├── assets/
│   └── characters/
│       ├── ash_ketchum/
│       │   ├── ash_ketchum_official_pokemoncom.png
│       │   └── ash_ketchum_silhouette.png
│       ├── misty/
│       │   ├── misty_official_bulbapedia.png
│       │   └── misty_silhouette.png
│       └── [character_slug]/
│           ├── [character_slug]_official_[source].png
│           └── [character_slug]_silhouette.png
```

## Official Source Priority (Descending Order)

### 1. Pokemon.com Assets
- **URL**: https://www.pokemon.com/
- **Best For**: Main characters, recent series
- **Usage**: Official character portraits, promotional art
- **How to Find**: Navigate to "Pokémon TV" or "Animation" sections

### 2. Bulbapedia Official Art
- **URL**: https://bulbapedia.bulbagarden.net/
- **Best For**: Comprehensive character database
- **Usage**: Go to character page → "Official artwork" section
- **Example**: https://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum

### 3. Serebii Character Database
- **URL**: https://www.serebii.net/anime/characters/
- **Best For**: Episode-specific character appearances
- **Usage**: Official anime screenshots and promotional materials

### 4. Pokémon Database
- **URL**: https://pokemondb.net/
- **Best For**: Game character artwork
- **Usage**: Official game sprites and promotional images

### 5. Official Game Box/Promotional Art
- **Sources**: Nintendo press kits, official game websites
- **Best For**: Game-specific characters (Champions, Gym Leaders)
- **Usage**: High-resolution promotional materials

## Image Specifications

### Required Metadata
```json
{
  "type": "official_portrait",
  "filename": "character_slug_official_source.png",
  "source": "https://exact-source-url.com/path/to/image",
  "license": "© The Pokémon Company",
  "resolution": "2048x2048",
  "season": "original|xy|journeys|etc",
  "region": "kanto|johto|hoenn|etc",
  "verified": true
}
```

### Image Requirements
- **Format**: PNG (preferred), JPG, or WebP
- **Minimum Resolution**: 512x512 pixels
- **Recommended Resolution**: 1024x1024 or higher
- **Aspect Ratio**: Square (1:1) preferred
- **Background**: Transparent or official background
- **Quality**: High-resolution, no compression artifacts

### Naming Convention
```
[character_slug]_official_[source_shortcode].[ext]

Examples:
- ash_ketchum_official_pokemoncom.png
- misty_official_bulbapedia.png
- cynthia_official_bdsp.png
- leon_official_swsh.png
```

## Verification Process

### Step 1: Source Verification
1. Verify image is from an official source (see priority list above)
2. Check that the source URL is legitimate
3. Confirm image is not fan art or AI-generated
4. Verify character identity matches 100%

### Step 2: Quality Check
1. Minimum resolution met (512x512)
2. Image is clear and unmodified
3. No watermarks except official ones
4. Proper framing (head and shoulders visible)

### Step 3: Update Manifest
Update `src/data/characters-manifest.json`:
```json
{
  "character": "Ash Ketchum",
  "slug": "ash_ketchum",
  "images": [
    {
      "type": "official_portrait",
      "filename": "ash_ketchum_official_pokemoncom.png",
      "source": "https://www.pokemon.com/us/pokemon-episodes/pokemon-characters/ash-ketchum/",
      "resolution": "2048x2048",
      "season": "original",
      "region": "kanto",
      "verified": true  // ← Change to true after verification
    }
  ]
}
```

### Step 4: Add Image File
1. Create directory: `src/assets/characters/[character_slug]/`
2. Add official image with correct filename
3. Optionally add silhouette version
4. Test image loads correctly in application

## Season-Specific Variants

For characters with multiple outfit variations:
```json
{
  "character": "Ash Ketchum",
  "slug": "ash_ketchum",
  "images": [
    {
      "type": "official_portrait",
      "filename": "ash_ketchum_official_kanto.png",
      "season": "original",
      "region": "kanto",
      "verified": true
    },
    {
      "type": "official_portrait",
      "filename": "ash_ketchum_official_kalos.png",
      "season": "xy",
      "region": "kalos",
      "verified": true
    },
    {
      "type": "official_portrait",
      "filename": "ash_ketchum_official_alola.png",
      "season": "sun_moon",
      "region": "alola",
      "verified": true
    }
  ]
}
```

## Rejected Sources

### ❌ DO NOT USE:
- DeviantArt or other fan art sites
- AI-generated images (Midjourney, DALL-E, Stable Diffusion)
- Pinterest (usually not original source)
- Generic stock photo sites
- Cosplay photos
- Unofficial wikis without source attribution
- Low-resolution images (<512px)
- Modified or edited official images

## Confidence Scoring

The system automatically scores images:
- **100%**: Verified official image from priority source
- **95-99%**: Official source but pending manual verification
- **50-94%**: Partial verification or secondary source
- **0-49%**: Placeholder or unverified
- **<95%**: Will trigger warning badge in UI

## Adding a New Character

1. **Locate Official Image**
   - Search official sources in priority order
   - Download highest resolution available
   - Note exact source URL

2. **Prepare Image**
   - Resize if needed (maintain aspect ratio)
   - Optimize file size (use PNG compression)
   - Rename following convention

3. **Update Manifest**
   ```bash
   # Edit src/data/characters-manifest.json
   # Add new character entry with complete metadata
   ```

4. **Add Image Files**
   ```bash
   mkdir src/assets/characters/[slug]
   # Add official image to directory
   ```

5. **Test**
   - Verify image displays correctly
   - Check validation status shows green checkmark
   - Confirm no console errors

## QA Report

The system maintains a QA report in the manifest:
```json
"qa_report": {
  "missing_canonical_art": ["Character Name"],
  "low_confidence_images": ["Character Name"],
  "pending_verification": ["Status message"]
}
```

Update this section as you complete verifications.

## Legal Compliance

- All images © The Pokémon Company / Nintendo / Game Freak
- Used under fair use for educational/reference purposes
- Always credit original source
- Do not redistribute or use commercially
- Link to official sources when possible

## Support

For questions or issues:
1. Check validation errors in browser console
2. Review `src/utils/characterImageValidator.ts` logic
3. Verify manifest JSON syntax
4. Ensure image paths are correct
