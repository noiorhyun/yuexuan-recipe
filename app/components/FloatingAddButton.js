'use client';

import Link from 'next/link';
import styles from './FloatingAddButton.module.css';

export default function FloatingAddButton() {
  return (
    <Link href="/recipes/add" className={styles.fab} title="Add New Recipe">
      <span className={styles.icon}>+</span>
    </Link>
  );
} 