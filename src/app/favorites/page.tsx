'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Heart } from 'lucide-react';

import { ResourceList } from '@/components/resources/ResourceList';
import { ResourceTableView } from '@/components/resources/ResourceTableView';
import { ResourceModal } from '@/components/resources/ResourceModal';
import { ViewToggle, type ViewMode } from '@/components/resources/ViewToggle';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import type { Resource } from '@/lib/types';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load view preference from localStorage
  useEffect(() => {
    setMounted(true);
    const savedView = localStorage.getItem('viewMode') as ViewMode | null;
    if (savedView === 'card' || savedView === 'table') {
      setViewMode(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
    localStorage.setItem('viewMode', view);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <main className="container mx-auto min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="mb-4 gap-2" aria-label="Back to search">
              <ArrowLeft className="size-4" />
              Back to Search
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Favorites</h1>
              <p className="text-muted-foreground text-lg">
                {favorites.length === 0
                  ? 'No favorites yet'
                  : `${favorites.length} saved resource${favorites.length === 1 ? '' : 's'}`}
              </p>
            </div>
            {favorites.length > 0 && (
              <ViewToggle view={viewMode} onViewChange={handleViewChange} />
            )}
          </div>
        </motion.div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              description="Start exploring and save your favorite resources by clicking the heart icon on any resource card."
              action={
                <Link href="/">
                  <Button>Start Exploring</Button>
                </Link>
              }
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === 'card' ? (
                <ResourceList
                  resources={favorites}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onResourceClick={setSelectedResource}
                />
              ) : (
                <ResourceTableView
                  resources={favorites}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onRowClick={setSelectedResource}
                />
              )}
            </motion.div>
          </motion.div>
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

