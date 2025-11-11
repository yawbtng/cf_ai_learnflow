import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'View your saved learning resources on LearnFlow',
  openGraph: {
    title: 'My Favorites | LearnFlow',
    description: 'View your saved learning resources on LearnFlow',
  },
  twitter: {
    title: 'My Favorites | LearnFlow',
    description: 'View your saved learning resources on LearnFlow',
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

