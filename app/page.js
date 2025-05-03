import Image from "next/image";
import Link from "next/link";
import LoginForm from "./components/LoginForm";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.backgroundAnimation}></div>
      <main className={styles.mainContent}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Welcome to RecipeNest</h1>

        </div>

        <div className={styles.loginSectionWrapper}>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
