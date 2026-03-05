<<<<<<< HEAD
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
=======
>>>>>>> e35f76c (refactor(website): remove unused component and update styles)
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
    <section id="section2" className={styles['section-container']}>
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

<<<<<<< HEAD
<<<<<<< HEAD
        {/* CỘT PHẢI: Nội dung thuyết phục */}
>>>>>>> 74fa2db (feat(website): update about us section with new content)
=======
        {/* CỘT PHẢI: Nội dung trực diện, sắc bén */}
>>>>>>> 30701e0 (feat(website): add new section and update existing components)
=======
        {/* CỘT PHẢI: Nội dung và Số liệu đếm ngược */}
>>>>>>> e35f76c (refactor(website): remove unused component and update styles)
        <div className={styles['text-col']}>
          <div className={styles.subtitle}>Virtual Try-On Solution</div>

          <h2 className={styles.title}>
<<<<<<< HEAD
<<<<<<< HEAD
            Bring the Fitting Room <br />
            to Your Website.
          </h2>

          <p className={styles.description}>
            Shoppers abandon carts because they can't visualize the fit.
            Garblo's AI plug-in lets customers see themselves in your clothes
            instantly, transforming hesitation into purchase confidence.
          </p>

<<<<<<< HEAD
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
=======
            Bring the Fitting Room <br />
            to Your Website.
>>>>>>> 30701e0 (feat(website): add new section and update existing components)
          </h2>

          <p className={styles.description}>
            Shoppers abandon carts because they can't visualize the fit.
            Garblo's AI plug-in lets customers see themselves in your clothes
            instantly, transforming hesitation into purchase confidence.
          </p>

          {/* Khối số liệu đắt giá với hiệu ứng động và nét đứt dọc */}
=======
>>>>>>> e35f76c (refactor(website): remove unused component and update styles)
          <div className={styles['stats-grid']}>
            <div className={styles['stat-item']}>
              <AnimatedStat endValue={-83} suffix="%" />
              <p>Cart Abandonment</p>
            </div>
            <div className={styles['stat-item']}>
<<<<<<< HEAD
              <h4>-20%</h4>
>>>>>>> 74fa2db (feat(website): update about us section with new content)
=======
              <AnimatedStat endValue={-20} suffix="%" />
>>>>>>> 30701e0 (feat(website): add new section and update existing components)
              <p>Return Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
