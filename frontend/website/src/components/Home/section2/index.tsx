/* frontend/website/src/components/Home/section2/index.tsx */
import React from 'react'
import styles from './styles.module.css'

export default function Section2(): JSX.Element {
  return (
    <section id="section2" className={styles['section-container']}>
      <div className={styles['section-wrapper']}>
        {/* CỘT TRÁI: Hình ảnh tính năng */}
        <div className={styles['image-col']}>
          <div className={styles['image-frame']}>
            {/* Ảnh minh họa khách hàng đang mua sắm trực tuyến (sẽ thay bằng UI của Garblo sau) */}
            <img
              src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2515&auto=format&fit=crop"
              alt="Virtual Try-On Experience 2026"
              className={styles['feature-image']}
            />
          </div>
        </div>

        {/* CỘT PHẢI: Nội dung thuyết phục */}
        <div className={styles['text-col']}>
          <div className={styles.subtitle}>Virtual Try-On Solution</div>

          <h2 className={styles.title}>
            Help them visualize. <br />
            Watch your sales grow.
          </h2>

          <p className={styles.description}>
            Shoppers hesitate when they can't visualize the fit. Garblo's AI
            plug-in lets your customers try on outfits virtually right on your
            website, transforming hesitation into purchase confidence.
          </p>

          {/* Khối số liệu đắt giá đánh vào tâm lý chủ shop */}
          <div className={styles['stats-grid']}>
            <div className={styles['stat-item']}>
              <h4>-83%</h4>
              <p>Cart Abandonment</p>
            </div>
            <div className={styles['stat-item']}>
              <h4>-20%</h4>
              <p>Return Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
