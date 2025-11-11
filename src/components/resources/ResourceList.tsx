'use client';

import { ResourceCard } from './ResourceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import type { Resource } from '@/lib/types';

export interface ResourceListProps {
  resources: Resource[];
  favorites: Resource[];
  onToggleFavorite: (resource: Resource) => void;
  onResourceClick?: (resource: Resource) => void;
  loading?: boolean;
}

function ResourceCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </Card>
  );
}

export function ResourceList({
  resources,
  favorites,
  onToggleFavorite,
  onResourceClick,
  loading = false,
}: ResourceListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ResourceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No resources found"
        description="Try searching for a different topic or adjusting your learning style preference. You can search for any topic you'd like to learn about!"
      />
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {resources.map((resource, index) => (
        <motion.div
          key={resource.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: index * 0.05,
                duration: 0.3,
              },
            },
          }}
        >
          <ResourceCard
            resource={resource}
            isFavorite={favorites.some((fav) => fav.id === resource.id)}
            onToggleFavorite={onToggleFavorite}
            onClick={onResourceClick}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

