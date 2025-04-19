'use client';

import Link from 'next/link';
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/recipes" className={styles.navLink}>
          Recipes
        </Link>
      </div>
    </nav>
  );
} 