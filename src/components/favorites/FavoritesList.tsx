'use client';

import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ResourceList } from '@/components/resources/ResourceList';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import type { Resource } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface FavoritesListProps {
  favorites: Resource[];
  onToggleFavorite: (resource: Resource) => void;
}

export function FavoritesList({ favorites, onToggleFavorite }: FavoritesListProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (favorites.length === 0) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            aria-label="Toggle favorites section"
            aria-expanded={isOpen}
          >
            <span className="flex items-center gap-2">
              <Heart className="size-4" />
              Favorites ({favorites.length})
            </span>
            {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="text-muted-foreground mb-4 size-12" />
            <p className="text-muted-foreground text-lg">No favorites yet</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Start exploring and save your favorite resources by clicking the heart icon.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          aria-label="Toggle favorites section"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2">
            <Heart className="size-4 fill-red-500 text-red-500" />
            Favorites ({favorites.length})
          </span>
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <ResourceList
          resources={favorites}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

