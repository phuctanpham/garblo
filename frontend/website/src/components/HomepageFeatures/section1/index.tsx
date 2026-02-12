/* frontend/website/src/components/Section1/index.tsx */
import React from 'react'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'

export default function Section1(): JSX.Element {
  return (
    <section className={styles['hero-container']}>
      <div className={styles['hero-wrapper']}>
        {/* CỘT TRÁI: Nội dung Text */}
        <div className={styles['left-content']}>
          <div className={styles.tagline}>
            <span>✨</span> B2B Fashion SaaS Platform
          </div>

          <h1 className={styles.title}>
            Revolutionize Your <br />
            Fashion Store with <span className={styles.highlight}>AI.</span>
          </h1>

          <p className={styles.description}>
            The all-in-one platform for modern brands. Enable{' '}
            <strong>Virtual Try-On</strong> to boost sales, and generate{' '}
            <strong>Pro Lookbooks</strong> instantly without studio costs.
          </p>

          <div className={styles.actions}>
            <Link to="/start-trial" className={styles['primary-btn']}>
              Start Free Trial
            </Link>
            <Link to="#how-it-works" className={styles['secondary-btn']}>
              See How It Works
            </Link>
          </div>
        </div>

        {/* CỘT PHẢI: Hình ảnh minh họa */}
        <div className={styles['right-content']}>
          {/* Tạm thời dùng ảnh mẫu Unsplash chất lượng cao */}
          <img
            src="https://images.unsplash.com/photo-1550614000-4b951987967d?q=80&w=2574&auto=format&fit=crop"
            alt="Garblo AI Fashion Tech"
            className={styles['mockup-image']}
          />
        </div>
      </div>
    </section>
  )
}
