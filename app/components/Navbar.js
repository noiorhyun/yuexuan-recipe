'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

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
    </nav>
  );
} 