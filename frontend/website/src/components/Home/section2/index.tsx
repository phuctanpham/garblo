/* frontend/website/src/components/Home/section2/index.tsx */
import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'

// Component đếm số cực mượt do tôi tự viết cho Garblo
const AnimatedStat = ({ endValue, suffix = '' }) => {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const duration = 2000 // Chạy trong 2 giây
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
          observer.disconnect() // Chạy 1 lần rồi thôi
        }
      },
      { threshold: 0.5 },
    ) // Cuộn đến giữa khối mới chạy

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
        {/* CỘT TRÁI: Hình ảnh - Đã thay bằng ảnh một người đang dùng điện thoại di động */}
        <div className={styles['image-col']}>
          <div className={styles['image-frame']}>
            <img
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop"
              alt="Garblo Virtual Try-On App Interface"
              className={styles['feature-image']}
            />
          </div>
        </div>

        {/* CỘT PHẢI: Nội dung trực diện, sắc bén */}
        <div className={styles['text-col']}>
          <div className={styles.subtitle}>Virtual Try-On Solution</div>

          <h2 className={styles.title}>
            Bring the Fitting Room <br />
            to Your Website.
          </h2>

          <p className={styles.description}>
            Shoppers abandon carts because they can't visualize the fit.
            Garblo's AI plug-in lets customers see themselves in your clothes
            instantly, transforming hesitation into purchase confidence.
          </p>

          {/* Khối số liệu đắt giá với hiệu ứng động và nét đứt dọc */}
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
