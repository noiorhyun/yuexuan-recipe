'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import styles from './Navigation.module.css';

export default function Navigation() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <Link href="/recipes" className={styles.logo}>
          RecipeNest
        </Link>

        <div className={styles.navLinks}>
          <Link href="/recipes" className={styles.navLink}>
            Recipes
          </Link>
          <Link href="/categories" className={styles.navLink}>
            Categories
          </Link>
        </div>

        <div className={styles.profileSection} ref={profileRef}>
          <button
            className={styles.profileButton}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Profile menu"
          >
            <FaUserCircle className={styles.profileIcon} />
          </button>
          {isProfileOpen && (
            <div className={styles.dropdown}>
              <Link href="/profile" className={styles.dropdownItem}>
                My Profile
              </Link>
              <Link href="/profile/my-recipes" className={styles.dropdownItem}>
                My Recipes
              </Link>
              <button onClick={handleLogout} className={styles.dropdownItem}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <Link href="/recipes/add" className={styles.addRecipeButton}>
        + Add Recipe
      </Link>
    </nav>
  );
} 