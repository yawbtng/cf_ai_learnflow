'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'motion/react';

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <motion.h1
            className="text-xl font-bold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            LearnFlow
          </motion.h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Search
          </Link>
          <Link
            href="/favorites"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Favorites
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  );
}

