'use client';

import Link from 'next/link';
import styles from './page.module.css';

const categories = [
  { name: 'Chinese', imageUrl: 'https://images-cdn.welcomesoftware.com/Zz0zMDM2ZWM5NmQ5YjAxMWViODcwYmI5NWUzYmNlYzM0NA==/Zz01NTg2OGYyMmQ4MmYxMWViOGM4NjRkNDA4MzFmNzQ4OA%3D%3D.jpg' },
  { name: 'Thai', imageUrl: 'https://thumbor.thebear.group/unsafe/1110x555/https://directus-deskthebear.s3.ap-southeast-1.amazonaws.com/uploads/7481fb8c-94a9-4d50-9db7-08092b7b4b62.jpeg' },
  { name: 'Japanese', imageUrl: 'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/00/a0000370/img/basic/a0000370_main.jpg' },
  { name: 'Mexican', imageUrl: 'https://www.studyspanishlatinamerica.com/blog/wp-content/uploads/2021/06/guide-to-popular-mexican-food.jpg' },
  { name: 'Italian', imageUrl: 'https://rp-cms.imgix.net/wp-content/uploads/AdobeStock_513646998-scaled.jpeg' },
  { name: 'Indian', imageUrl: 'https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,q_auto,w_750/f_auto/tk-traditional-indian-foods-to-taste-in-2022-phpEXAXNS' },
];

export default function CategoriesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recipe Categories</h1>
      <div className={styles.categoryGrid}>
        {categories.map((category) => (
          <Link 
            key={category.name} 
            href={`/categories/${encodeURIComponent(category.name.toLowerCase())}`} 
            className={styles.categoryLink}
          >
            <div className={styles.categoryCard}>
              <img 
                src={category.imageUrl} 
                alt={`${category.name} cuisine`} 
                className={styles.categoryImage} 
              />
              <div className={styles.cardContent}>
                <h2 className={styles.categoryName}>{category.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 