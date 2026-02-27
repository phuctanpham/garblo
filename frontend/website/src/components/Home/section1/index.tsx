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
=======
          {/* Tiêu đề mới: Đưa chữ Revolutionize lên đầu, bôi màu xanh và bỏ chữ "with AI" */}
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
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
            <Link to="#section2" className={styles['secondary-btn']}>
=======
            <Link to="#features" className={styles['secondary-btn']}>
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
              Explore Solutions
            </Link>
          </div>
        </div>

        {/* CỘT PHẢI: Hình ảnh minh họa */}
        <div className={styles['right-content']}>
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
            className={styles['mockup-image']}
          />
        </div>
      </div>
    </section>
  )
}
