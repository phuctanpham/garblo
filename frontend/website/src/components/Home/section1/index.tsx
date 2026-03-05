/* frontend/website/src/components/Section1/index.tsx */
import React from 'react'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'

export default function Section1(): JSX.Element {
  return (
    <section className={styles['hero-container']}>
      <div className={styles['hero-wrapper']}>
        <div className={styles['left-content']}>
<<<<<<< HEAD
<<<<<<< HEAD
=======
          {/* Tiêu đề mới: Đưa chữ Revolutionize lên đầu, bôi màu xanh và bỏ chữ "with AI" */}
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
=======
>>>>>>> 30701e0 (feat(website): add new section and update existing components)
          <h1 className={styles.title}>
            <span className={styles.highlight}>Revolutionize</span> <br />
            Your Fashion Store.
          </h1>
          <p className={styles.description}>
            The all-in-one platform for modern brands. Enable{' '}
            <strong>Virtual Try-On</strong> to boost sales, and generate{' '}
            <strong>Pro Lookbooks</strong> instantly without studio costs.
          </p>
          <div className={styles.actions}>
            <Link to="/" className={styles['primary-btn']}>
              Start Free Trial
            </Link>
<<<<<<< HEAD
<<<<<<< HEAD
            <Link to="#section2" className={styles['secondary-btn']}>
=======
            <Link to="#features" className={styles['secondary-btn']}>
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
=======
            <Link to="#section2" className={styles['secondary-btn']}>
>>>>>>> e76b32f (refactor(website): adjust layout of virtual try-on section)
              Explore Solutions
            </Link>
          </div>
        </div>

        <div className={styles['right-content']}>
<<<<<<< HEAD
<<<<<<< HEAD
          <img
            src="https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=2574&auto=format&fit=crop"
            alt="Garblo AI Generated Fashion Lookbook"
=======
          {/* Đã thay bằng ảnh tĩnh chất lượng cao, sang trọng, không bao giờ bị lỗi */}
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop"
            alt="Garblo Modern Fashion Retail"
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
=======
          {/* Ảnh mới: Mang tính chất công nghệ AI quét 3D quần áo/cơ thể */}
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop"
            alt="Garblo AI Fashion Tech"
>>>>>>> 30701e0 (feat(website): add new section and update existing components)
            className={styles['mockup-image']}
          />
        </div>
      </div>
    </section>
  )
}
