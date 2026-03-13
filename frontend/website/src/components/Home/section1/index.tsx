/* frontend/website/src/components/Section1/index.tsx */
import React from 'react'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'

export default function Section1(): JSX.Element {
  return (
    <section className={styles['hero-container']}>
      <div className={styles['hero-wrapper']}>
        <div className={styles['left-content']}>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
          {/* Tiêu đề mới: Đưa chữ Revolutionize lên đầu, bôi màu xanh và bỏ chữ "with AI" */}
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
=======
>>>>>>> 30701e0 (feat(website): add new section and update existing components)
=======
          {/* Tiêu đề mới: Đưa chữ Revolutionize lên đầu, bôi màu xanh và bỏ chữ "with AI" */}
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
=======
>>>>>>> 30701e0 (feat(website): add new section and update existing components)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            <Link to="#section2" className={styles['secondary-btn']}>
=======
            <Link to="#features" className={styles['secondary-btn']}>
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
=======
            <Link to="#section2" className={styles['secondary-btn']}>
>>>>>>> e76b32f (refactor(website): adjust layout of virtual try-on section)
=======
            <Link to="/#section2" className={styles['secondary-btn']}>
>>>>>>> ce5e4d2 (chore(deps): bump the npm_and_yarn group across 3 directories with 5 updates (#11))
=======
            <Link to="/#section2" className={styles['secondary-btn']}>
>>>>>>> 5074470 (fix: resolve broken anchor links and stylelint errors)
=======
            <Link to="#features" className={styles['secondary-btn']}>
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
=======
            <Link to="#section2" className={styles['secondary-btn']}>
>>>>>>> e76b32f (refactor(website): adjust layout of virtual try-on section)
=======
            <Link to="/#section2" className={styles['secondary-btn']}>
>>>>>>> ce5e4d2 (chore(deps): bump the npm_and_yarn group across 3 directories with 5 updates (#11))
=======
            <Link to="/#section2" className={styles['secondary-btn']}>
>>>>>>> 5074470 (fix: resolve broken anchor links and stylelint errors)
              Explore Solutions
            </Link>
          </div>
        </div>

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        {/* CỘT PHẢI: Hình ảnh/Video minh họa */}
        <div className={styles['right-content']}>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          <img
            src="https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=2574&auto=format&fit=crop"
            alt="Garblo AI Generated Fashion Lookbook"
=======
          {/* Đã thay bằng ảnh tĩnh chất lượng cao, sang trọng, không bao giờ bị lỗi */}
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop"
            alt="Garblo Modern Fashion Retail"
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
=======
          {/* Ảnh mới: Mang tính chất công nghệ AI quét 3D quần áo/cơ thể */}
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop"
            alt="Garblo AI Fashion Tech"
>>>>>>> 30701e0 (feat(website): add new section and update existing components)
=======
          <img
            src="https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=2574&auto=format&fit=crop"
            alt="Garblo AI Generated Fashion Lookbook"
>>>>>>> e35f76c (refactor(website): remove unused component and update styles)
=======
          {/* Đã thay bằng ảnh tĩnh chất lượng cao, sang trọng, không bao giờ bị lỗi */}
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop"
            alt="Garblo Modern Fashion Retail"
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
=======
=======
        {/* CỘT PHẢI: Hình ảnh minh họa */}
>>>>>>> e35f76c (refactor(website): remove unused component and update styles)
        <div className={styles['right-content']}>
          <img
<<<<<<< HEAD
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop"
            alt="Garblo AI Fashion Tech"
>>>>>>> 30701e0 (feat(website): add new section and update existing components)
=======
            src="https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=2574&auto=format&fit=crop"
            alt="Garblo AI Generated Fashion Lookbook"
>>>>>>> e35f76c (refactor(website): remove unused component and update styles)
            className={styles['mockup-image']}
          />
=======
=======
        {/* CỘT PHẢI: Hình ảnh minh họa */}
=======
>>>>>>> ce5e4d2 (chore(deps): bump the npm_and_yarn group across 3 directories with 5 updates (#11))
        {/* CỘT PHẢI: Hình ảnh/Video minh họa */}
        <div className={styles['right-content']}>
>>>>>>> 5074470 (fix: resolve broken anchor links and stylelint errors)
=======
        {/* CỘT PHẢI: Hình ảnh minh họa */}
        {/* CỘT PHẢI: Hình ảnh/Video minh họa */}
        <div className={styles['right-content']}>
>>>>>>> c20a7f8 (feat(website): update hero section content and styles)
=======
        {/* CỘT PHẢI: Hình ảnh minh họa */}
        {/* CỘT PHẢI: Hình ảnh/Video minh họa */}
        <div className={styles['right-content']}>
>>>>>>> 5074470 (fix: resolve broken anchor links and stylelint errors)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> c20a7f8 (feat(website): update hero section content and styles)
=======
>>>>>>> 5074470 (fix: resolve broken anchor links and stylelint errors)
=======
>>>>>>> c20a7f8 (feat(website): update hero section content and styles)
=======
>>>>>>> 5074470 (fix: resolve broken anchor links and stylelint errors)
        </div>
      </div>
    </section>
  )
}
