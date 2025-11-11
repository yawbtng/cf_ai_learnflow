'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ExternalLink, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Resource } from '@/lib/types';
import { cn } from '@/lib/utils';
import { sourceColors, sourceLabels } from '@/lib/constants';
import { useReducedMotion } from 'motion/react';

export interface ResourceTableViewProps {
  resources: Resource[];
  favorites: Resource[];
  onToggleFavorite: (resource: Resource) => void;
  onRowClick?: (resource: Resource) => void;
}

export function ResourceTableView({
  resources,
  favorites,
  onToggleFavorite,
  onRowClick,
}: ResourceTableViewProps) {
  const reducedMotion = useReducedMotion();
  // Table sorting is disabled - resources are sorted by ResourceFilters

  const isFavorite = (resource: Resource) => {
    return favorites.some((fav) => fav.id === resource.id);
  };

  const columns: ColumnDef<Resource>[] = React.useMemo(
    () => [
      {
        accessorKey: 'thumbnail',
        header: '',
        cell: ({ row }) => {
          const resource = row.original;
          return resource.thumbnail ? (
            <div className="relative size-16 overflow-hidden rounded-md">
              <Image
                src={resource.thumbnail}
                alt={resource.title}
                fill
                className="object-cover"
                sizes="64px"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="size-16 rounded-md bg-muted" />
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'title',
        header: () => {
          return <span className="text-sm font-medium">Title</span>;
        },
        enableSorting: false,
        cell: ({ row }) => {
          const resource = row.original;
          return (
            <div className="max-w-[300px]">
              <div className="font-medium line-clamp-2">{resource.title}</div>
              {resource.summary && (
                <div className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {resource.summary}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'source',
        header: () => {
          return <span className="text-sm font-medium">Source</span>;
        },
        enableSorting: false,
        cell: ({ row }) => {
          const resource = row.original;
          const sourceColor = sourceColors[resource.source];
          const sourceLabel = sourceLabels[resource.source];
          return (
            <Badge className={cn('text-xs uppercase', sourceColor)}>{sourceLabel}</Badge>
          );
        },
      },
      {
        accessorKey: 'publishedAt',
        header: () => {
          return <span className="text-sm font-medium">Date</span>;
        },
        enableSorting: false,
        cell: ({ row }) => {
          const resource = row.original;
          return resource.publishedAt ? (
            <div className="text-muted-foreground text-sm">
              {new Date(resource.publishedAt).toLocaleDateString()}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const resource = row.original;
          const favorite = isFavorite(resource);
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(resource);
                }}
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={favorite}
              >
                <Heart
                  className={cn('size-4 transition-colors', favorite && 'fill-red-500 text-red-500')}
                />
              </Button>
              <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon-sm" aria-label={`Open ${resource.title}`}>
                  <ExternalLink className="size-4" />
                </Button>
              </Link>
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [favorites, onToggleFavorite]
  );

  const table = useReactTable({
    data: resources,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Disable table sorting - resources are already sorted by ResourceFilters
  });

  if (resources.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
      className="w-full overflow-hidden rounded-md border"
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  'transition-colors hover:bg-muted/50',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}

