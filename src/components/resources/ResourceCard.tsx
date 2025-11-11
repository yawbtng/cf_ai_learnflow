'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import type { Resource } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface ResourceCardProps {
  resource: Resource;
  isFavorite: boolean;
  onToggleFavorite: (resource: Resource) => void;
  onClick?: (resource: Resource) => void;
}

const sourceColors: Record<Resource['source'], string> = {
  youtube: 'bg-red-500 text-white',
  spotify: 'bg-green-500 text-white',
  article: 'bg-blue-500 text-white',
};

const sourceLabels: Record<Resource['source'], string> = {
  youtube: 'YouTube',
  spotify: 'Spotify',
  article: 'Article',
};

export function ResourceCard({
  resource,
  isFavorite,
  onToggleFavorite,
  onClick,
}: ResourceCardProps) {
  const sourceColor = sourceColors[resource.source];
  const sourceLabel = sourceLabels[resource.source];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card
        className="group flex h-full flex-col overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => onClick?.(resource)}
      >
      {resource.thumbnail && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={resource.thumbnail}
            alt={resource.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">{resource.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(resource);
            }}
            className="shrink-0"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
          >
            <Heart
              className={cn('size-5 transition-colors', isFavorite && 'fill-red-500 text-red-500')}
            />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn('text-xs uppercase', sourceColor)}>{sourceLabel}</Badge>
          {resource.publishedAt && (
            <span className="text-muted-foreground text-xs">
              {new Date(resource.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {resource.reason && (
          <CardDescription className="italic text-sm">{resource.reason}</CardDescription>
        )}
        {resource.summary && (
          <p className="text-muted-foreground line-clamp-3 text-sm">{resource.summary}</p>
        )}
        <Link
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto"
        >
          <Button variant="outline" className="w-full" aria-label={`Open ${resource.title}`}>
            Open Resource
          </Button>
        </Link>
      </CardContent>
    </Card>
    </motion.div>
  );
}

