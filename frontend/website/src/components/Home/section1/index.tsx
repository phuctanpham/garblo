/* frontend/website/src/components/Section1/index.tsx */
import React from 'react'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'

export default function Section1() {
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
            <Link to="https://mvp.garblo.com" className={styles['primary-btn']}>
              Start Free Trial
            </Link>
            <Link to="/#section4" className={styles['secondary-btn']} data-noBrokenLinkCheck>
              Contact Us
            </Link>
          </div>
        </div>

        {/* CỘT PHẢI: Hình ảnh minh họa */}
        {/* CỘT PHẢI: Hình ảnh/Video minh họa */}
        <div className={styles['right-content']}>
          <video
            autoPlay /* Tự động chạy khi load trang */
            loop /* Lặp lại liên tục */
            muted /* Bắt buộc phải tắt tiếng thì trình duyệt mới cho autoPlay */
            playsInline /* Hỗ trợ chạy mượt trên Safari/iPhone */
            className={
              styles['mockup-image']
            } /* Giữ nguyên class này để video vừa khít cái khung */
          >
            <source src="/img/section1/IntroGarblo.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  )
}
