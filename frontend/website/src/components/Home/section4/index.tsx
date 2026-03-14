/* frontend/website/src/components/Home/section4/index.tsx */
import React from 'react'
import styles from './styles.module.css'

export default function Section4(): JSX.Element {
  return (
    <section id="section4" className={styles['section-container']}>
      <div className={styles['section-wrapper']}>
        <div className={styles.subtitle}>Get Early Access</div>
        <h2 className={styles.title}>
          Ready to Revolutionize <br /> Your Brand?
        </h2>
        <p className={styles.description}>
          Join the waitlist today to experience Garblo's Virtual Try-On and AI
          Lookbook tools. We'll get back to you within 24 hours.
        </p>

        {/* Khối Form gửi dữ liệu */}
        <div className={styles['form-card']}>
          <form action="https://formspree.io/f/myknpynz" method="POST">
            <div className={styles['form-group']}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles['form-input']}
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="email">Work Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles['form-input']}
                placeholder="john@yourbrand.com"
                required
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="brand">Brand Name / Website</label>
              <input
                type="text"
                id="brand"
                name="brand"
                className={styles['form-input']}
                placeholder="www.yourbrand.com"
                required
              />
            </div>

            <button type="submit" className={styles['submit-btn']}>
              Start Free Trial
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
