'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const targetUrl = `/recipes?q=${encodeURIComponent(trimmedQuery)}`;
      console.log('[Navbar] Navigating to:', targetUrl);
      router.push(targetUrl);
      setSearchQuery('');
    } else {
      console.log('[Navbar] Navigating to: /recipes (empty search)');
      router.push('/recipes');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">RecipeNest</Link>
      </div>
      <div className={styles.links}>
        <Link 
          href="/" 
          className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
        >
          Home
        </Link>
        <Link 
          href="/recipes" 
          className={`${styles.link} ${pathname === '/recipes' ? styles.active : ''}`}
        >
          Recipes
        </Link>
        <Link 
          href="/categories" 
          className={`${styles.link} ${pathname === '/categories' ? styles.active : ''}`}
        >
          Categories
        </Link>
        <Link 
          href="/recipes/add" 
          className={`${styles.link} ${pathname === '/recipes/add' ? styles.active : ''}`}
        >
          Add Recipe
        </Link>
      </div>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
    </nav>
  );
} 