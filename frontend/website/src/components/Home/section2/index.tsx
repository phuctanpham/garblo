<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'

// Component đếm số tự động
const AnimatedStat = ({ endValue, suffix = '' }) => {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const duration = 2000
          const step = endValue / (duration / 16)
          const timer = setInterval(() => {
            start += step
            if (start <= endValue) {
              setValue(endValue)
              clearInterval(timer)
            } else {
              setValue(Math.round(start))
            }
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [endValue])

  return (
    <h4 ref={ref}>
      {value}
      {suffix}
    </h4>
  )
}

export default function Section2(): JSX.Element {
  return (
    <section className={styles['section-container']}>
      <div className={styles['section-wrapper']}>
        {/* CỘT TRÁI: 3 Khối tính năng theo yêu cầu mới */}
        <div className={styles['features-list']}>
          <div className={styles['feature-card']}>
            <div className={styles['icon-box']}>✨</div>
            <div className={styles['feature-info']}>
              <h3>Instant Try-On</h3>
              <p>
                Shoppers upload a simple photo to virtually wear any item in
                your catalog in seconds.
              </p>
            </div>
          </div>

          <div className={styles['feature-card']}>
            <div className={styles['icon-box']}>📏</div>
            <div className={styles['feature-info']}>
              <h3>Size Confidence</h3>
              <p>
                Eliminate guesswork. Customers see exactly how the garment fits
                their unique body shape.
              </p>
            </div>
          </div>

          <div className={styles['feature-card']}>
            <div className={styles['icon-box']}>⚡</div>
            <div className={styles['feature-info']}>
              <h3>Seamless Integration</h3>
              <p>
                Deploy our plug-in to your e-commerce store in minutes. Zero
                complex coding required.
              </p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Nội dung và Số liệu đếm ngược */}
=======
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
>>>>>>> 74fa2db (feat(website): update about us section with new content)
        <div className={styles['text-col']}>
          <div className={styles.subtitle}>Virtual Try-On Solution</div>

          <h2 className={styles.title}>
<<<<<<< HEAD
            Bring the Fitting Room <br />
            to Your Website.
          </h2>

          <p className={styles.description}>
            Shoppers abandon carts because they can't visualize the fit.
            Garblo's AI plug-in lets customers see themselves in your clothes
            instantly, transforming hesitation into purchase confidence.
          </p>

          <div className={styles['stats-grid']}>
            <div className={styles['stat-item']}>
              <AnimatedStat endValue={-83} suffix="%" />
              <p>Cart Abandonment</p>
            </div>
            <div className={styles['stat-item']}>
              <AnimatedStat endValue={-20} suffix="%" />
=======
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
>>>>>>> 74fa2db (feat(website): update about us section with new content)
              <p>Return Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
