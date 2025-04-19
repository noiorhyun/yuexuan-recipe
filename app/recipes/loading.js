import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Recipes</h1>
      <div className={styles.loading}>Loading recipes...</div>
    </div>
  );
} 