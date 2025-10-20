import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import characterManifestData from '@/data/characters-manifest.json';
import { Character, CharacterManifest } from '@/types/character';
import { validateImageSource, getImageOrFallback } from '@/utils/characterImageValidator';

const characterManifest = characterManifestData as CharacterManifest;

const Characters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showQAReport, setShowQAReport] = useState(true);

  const filteredCharacters = characterManifest.characters.filter(char =>
    char.character.toLowerCase().includes(searchTerm.toLowerCase()) ||
    char.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    char.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    char.series.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const verifiedCount = characterManifest.characters.filter(
    char => char.images.some(img => img.verified)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold text-center mb-4">Anime Characters Database</h1>
        
        <div className="text-center mb-8">
          <Badge variant={verifiedCount > 0 ? "default" : "destructive"} className="mb-4">
            {verifiedCount} / {characterManifest.characters.length} Verified Official Images
          </Badge>
        </div>

        {showQAReport && characterManifest.qa_report && (
          <Alert className="mb-8 max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Image Quality Report:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {characterManifest.qa_report.missing_canonical_art.length > 0 && (
                    <li>
                      Missing canonical art: {characterManifest.qa_report.missing_canonical_art.length} characters
                    </li>
                  )}
                  {characterManifest.qa_report.pending_verification.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="text-xs mt-2 text-muted-foreground">
                  All images must be from official sources: Pokemon.com, Bulbapedia, Serebii, or official game/anime promotional materials.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, region, role, or series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => {
            const imageInfo = getImageOrFallback(character.images, character.character);
            const primaryImage = character.images[0];
            const validation = primaryImage ? validateImageSource(primaryImage) : null;

            return (
              <Card key={character.slug} className="p-6 hover:scale-105 transition-transform relative">
                {/* Image Status Indicator */}
                <div className="absolute top-2 right-2" title={validation?.valid ? "Verified Official" : "Pending Verification"}>
                  {validation?.valid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                <div className="text-center mb-4">
                  <Avatar className="w-32 h-32 mx-auto mb-4 ring-2 ring-primary/20">
                    {imageInfo.useImage && imageInfo.imagePath && (
                      <AvatarImage 
                        src={imageInfo.imagePath} 
                        alt={character.character}
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-secondary">
                      {imageInfo.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  {imageInfo.warning && (
                    <Badge variant="outline" className="mb-2 text-xs">
                      {imageInfo.warning}
                    </Badge>
                  )}
                  
                  <h2 className="text-2xl font-bold mb-2">{character.character}</h2>
                  <Badge className="mb-2">{character.role}</Badge>
                  
                  {primaryImage && !primaryImage.verified && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Official Source Required
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Region(s)</p>
                    <p className="text-sm">{character.region}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Series</p>
                    <p className="text-sm">{character.series}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Signature Team</p>
                    <div className="flex flex-wrap gap-1">
                      {character.team
                        .filter(member => member.is_signature)
                        .map((member) => (
                          <Badge key={member.pokemon_id} variant="outline" className="text-xs">
                            {member.pokemon_name}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  {character.canonical_image_source && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Source: {new URL(character.canonical_image_source).hostname}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No characters found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Characters;
