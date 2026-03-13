/* frontend/website/src/components/Home/section3/index.tsx */
import React from 'react'
import styles from './styles.module.css'

export default function Section3(): JSX.Element {
  return (
    <section id="section3" className={styles['section-container']}>
      <div className={styles['section-wrapper']}>
        {/* CỘT TRÁI: Nội dung */}
        <div className={styles['text-col']}>
          <div className={styles.subtitle}>AI Lookbook Generation</div>

          <h2 className={styles.title}>
            Goodbye Studio Costs.
            <br />
            Hello Instant Lookbooks.
          </h2>

          <p className={styles.description}>
            Stop wasting weeks and thousands of dollars on photoshoots. Garblo's
            generative AI transforms simple flat-lay photos into stunning,
            studio-quality editorial images featuring diverse virtual models.
          </p>

          <ul className={styles['feature-list']}>
            <li>
              <span className={styles['check-icon']}>✔</span>
              Zero model or photographer fees
            </li>
            <li>
              <span className={styles['check-icon']}>✔</span>
              Generate multiple ethnicities and body types
            </li>
            <li>
              <span className={styles['check-icon']}>✔</span>
              Hyper-realistic 8K resolution output
            </li>
          </ul>
        </div>

        {/* CỘT PHẢI: Hình ảnh Before / After */}
        <div className={styles['image-col']}>
          {/* Ảnh Before (Chiếc áo chụp phẳng) */}
          <img
            src="/img/section3/before-suit.png"
            alt="Garment Flatlay Before"
            className={styles['img-before']}
          />
          {/* Ảnh After (Người mẫu AI mặc chiếc áo đó) */}
          <img
            src="img/section3/after-model.png"
            alt="AI Generated Fashion Model"
            className={styles['img-after']}
          />
        </div>
      </div>
    </section>
  )
}
