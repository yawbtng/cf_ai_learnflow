'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ExternalLink, Heart, Calendar } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Resource } from '@/lib/types';
import { cn } from '@/lib/utils';
import { sourceColors, sourceLabels } from '@/lib/constants';

export interface ResourceModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (resource: Resource) => void;
}

/**
 * Safely extracts YouTube video ID from URL
 * Returns null if URL is invalid or doesn't match YouTube patterns
 */
function getYouTubeVideoId(url: string): string | null {
  try {
    // Basic URL validation
    if (!url || typeof url !== 'string') return null;
    
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    
    if (!match || !match[1]) return null;
    
    // Validate video ID format (should be 11 alphanumeric characters)
    const videoId = match[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return videoId;
    }
    
    return null;
  } catch {
    return null;
  }
}

export function ResourceModal({
  resource,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}: ResourceModalProps) {
  const reducedMotion = useReducedMotion();
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap and management
  useEffect(() => {
    if (!isOpen || !dialogContentRef.current) return;

    // Store the previously focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const container = dialogContentRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when modal opens
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // Return focus to previously focused element
      previousActiveElementRef.current?.focus();
    };
  }, [isOpen]);

  if (!resource) return null;

  const sourceColor = sourceColors[resource.source];
  const sourceLabel = sourceLabels[resource.source];
  const youtubeVideoId = resource.source === 'youtube' ? getYouTubeVideoId(resource.url) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent 
            ref={dialogContentRef}
            className="max-w-3xl max-h-[90vh] overflow-y-auto p-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              className="p-6"
            >
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">{resource.title}</DialogTitle>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className={cn('text-xs uppercase', sourceColor)}>
                        {sourceLabel}
                      </Badge>
                      {resource.publishedAt && (
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          <Calendar className="size-4" />
                          {new Date(resource.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="shrink-0"
                    aria-label="Close modal"
                  >
                    <X className="size-5" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Thumbnail or YouTube Embed */}
                {youtubeVideoId ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reducedMotion ? 0 : 0.1 }}
                    className="relative aspect-video w-full overflow-hidden rounded-lg"
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                      title={resource.title}
                      className="absolute inset-0 size-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </motion.div>
                ) : resource.thumbnail ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reducedMotion ? 0 : 0.1 }}
                    className="relative aspect-video w-full overflow-hidden rounded-lg"
                  >
                    <Image
                      src={resource.thumbnail}
                      alt={resource.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 768px"
                      loading="lazy"
                    />
                  </motion.div>
                ) : null}

                {/* Reason */}
                {resource.reason && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reducedMotion ? 0 : 0.2 }}
                  >
                    <h3 className="text-lg font-semibold mb-2">Why this was recommended</h3>
                    <p className="text-muted-foreground italic">{resource.reason}</p>
                  </motion.div>
                )}

                <Separator />

                {/* Summary */}
                {resource.summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reducedMotion ? 0 : 0.3 }}
                  >
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <p className="text-muted-foreground leading-relaxed">{resource.summary}</p>
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reducedMotion ? 0 : 0.4 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4"
                >
                  <Button
                    variant="outline"
                    onClick={() => onToggleFavorite(resource)}
                    className="flex-1 gap-2"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={isFavorite}
                  >
                    <Heart
                      className={cn('size-4 transition-colors', isFavorite && 'fill-red-500 text-red-500')}
                    />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  <Link href={resource.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full gap-2" aria-label={`Open ${resource.title}`}>
                      <ExternalLink className="size-4" />
                      Open Resource
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

