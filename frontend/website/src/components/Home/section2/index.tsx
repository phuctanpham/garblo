import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'

// Component đếm số tự động
const AnimatedStat = ({ endValue, suffix = '' }: { endValue: number; suffix?: string; }) => {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (endValue === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(0)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const duration = 2000
          const step = endValue / (duration / 16)
          timerRef.current = setInterval(() => {
            start += step
            if ((step > 0 && start >= endValue) || (step < 0 && start <= endValue)) {
              setValue(endValue)
              clearInterval(timerRef.current!)
              timerRef.current = null
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
    return () => {
      observer.disconnect()
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
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

        {/* CỘT PHẢI: Nội dung và Số liệu đếm ngược */}
        <div className={styles['text-col']}>
          <div className={styles.subtitle}>Virtual Try-On Solution</div>

          <h2 className={styles.title}>
            Bring the Fitting Room <br />
            to Your Website.
          </h2>

          <p className={styles.description}>
            Shoppers abandon carts because they can&apos;t visualize the fit.
            Garblo&apos;s AI plug-in lets customers see themselves in your clothes
            instantly, transforming hesitation into purchase confidence.
          </p>

          <div className={styles['stats-grid']}>
            <div className={styles['stat-item']}>
              <AnimatedStat endValue={-83} suffix="%" />
              <p>Cart Abandonment</p>
            </div>
            <div className={styles['stat-item']}>
              <AnimatedStat endValue={-20} suffix="%" />
              <p>Return Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
