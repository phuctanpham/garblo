import React from 'react'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'

export default function Section1(): JSX.Element {
  return (
    <section className={styles['hero-container']}>
      <div className={styles['hero-wrapper']}>
        <div className={styles['left-content']}>
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
            <Link to="/#section2" className={styles['secondary-btn']}>
              Explore Solutions
            </Link>
          </div>
        </div>

        {/* CỘT PHẢI: Hình ảnh/Video minh họa */}
        <div className={styles['right-content']}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles['mockup-image']}
          >
            <source src="/img/section1/IntroGarblo.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  )
}
