'use client';

import { useState, useEffect } from 'react';
import { SearchInput } from '@/components/search/SearchInput';
import { LearningStyleSelector, type LearningStyle } from '@/components/search/LearningStyleSelector';
import { ResourceList } from '@/components/resources/ResourceList';
import { ResourceTableView } from '@/components/resources/ResourceTableView';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { ResourceModal } from '@/components/resources/ResourceModal';
import { ViewToggle, type ViewMode } from '@/components/resources/ViewToggle';
import { useSearch } from '@/hooks/useSearch';
import { useFavorites } from '@/hooks/useFavorites';
import type { Resource } from '@/lib/types';
import { getStoredViewMode, setStoredValue } from '@/lib/localStorage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = getStoredViewMode();
    if (savedView) {
      setViewMode(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
    setStoredValue('viewMode', view);
  };
  const {
    resources,
    sortedResources,
    loading,
    error,
    search,
    clearError,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
  } = useSearch();
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <motion.h1
            className="mb-2 text-4xl font-bold"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            LearnFlow
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Discover personalized learning resources powered by AI
          </motion.p>
        </motion.div>

        {/* Search Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-8 space-y-6"
        >
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
        </motion.section>

        {/* Results Section */}
        {resources.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-semibold">Search Results</h2>
              <div className="flex items-center gap-4">
                <ViewToggle view={viewMode} onViewChange={handleViewChange} />
                <ResourceFilters
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSortFieldChange={setSortField}
                  onSortOrderChange={setSortOrder}
                />
              </div>
            </div>
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === 'card' ? (
          <ResourceList
                  resources={sortedResources}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            loading={loading}
                  onResourceClick={setSelectedResource}
                />
              ) : (
                <ResourceTableView
                  resources={sortedResources}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onRowClick={setSelectedResource}
                />
              )}
            </motion.div>
          </motion.section>
        )}

        {/* Resource Modal */}
        <ResourceModal
          resource={selectedResource}
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
          isFavorite={selectedResource ? favorites.some((fav) => fav.id === selectedResource.id) : false}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </main>
  );
}
