'use client';

import { ResourceCard } from './ResourceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import type { Resource } from '@/lib/types';

export interface ResourceListProps {
  resources: Resource[];
  favorites: Resource[];
  onToggleFavorite: (resource: Resource) => void;
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground text-lg">No resources found</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Try searching for a different topic or adjusting your learning style preference.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          isFavorite={favorites.some((fav) => fav.id === resource.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

