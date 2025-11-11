'use client';

import { useState } from 'react';
import { SearchInput } from '@/components/search/SearchInput';
import { LearningStyleSelector, type LearningStyle } from '@/components/search/LearningStyleSelector';
import { ResourceList } from '@/components/resources/ResourceList';
import { FavoritesList } from '@/components/favorites/FavoritesList';
import { useSearch } from '@/hooks/useSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
  const { resources, loading, error, search, clearError } = useSearch();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const handleSearch = async () => {
    if (!topic.trim()) {
      return;
    }
    if (!learningStyle) {
      // Default to visual if no style selected
      await search(topic, 'visual');
      return;
    }
    await search(topic, learningStyle);
  };

  const handleLearningStyleSelect = async (style: LearningStyle) => {
    setLearningStyle(style);
    // Auto-search if topic is already entered
    if (topic.trim()) {
      await search(topic, style);
    }
  };

  return (
    <main className="container mx-auto min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">LearnFlow</h1>
          <p className="text-muted-foreground text-lg">
            Discover personalized learning resources powered by AI
          </p>
        </header>

        {/* Search Section */}
        <section className="mb-8 space-y-6">
          <div className="space-y-4">
            <SearchInput
              value={topic}
              onChange={setTopic}
              onSubmit={handleSearch}
              placeholder="What would you like to learn about?"
              disabled={loading}
            />
            <LearningStyleSelector
              selectedStyle={learningStyle}
              onSelect={handleLearningStyleSelect}
              disabled={loading}
            />
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={clearError}
                  aria-label="Dismiss error"
                >
                  <X className="size-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </section>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <section className="mb-8">
            <FavoritesList favorites={favorites} onToggleFavorite={toggleFavorite} />
          </section>
        )}

        {/* Results Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {loading ? 'Searching...' : resources.length > 0 ? 'Search Results' : ''}
          </h2>
          <ResourceList
            resources={resources}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            loading={loading}
          />
        </section>
      </div>
    </main>
  );
}
