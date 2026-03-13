"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Section1;
/* frontend/website/src/components/Section1/index.tsx */
var react_1 = require("react");
var Link_1 = require("@docusaurus/Link");
var styles_module_css_1 = require("./styles.module.css");
function Section1() {
    return (<section className={styles_module_css_1.default['hero-container']}>
      <div className={styles_module_css_1.default['hero-wrapper']}>
        <div className={styles_module_css_1.default['left-content']}>
          <h1 className={styles_module_css_1.default.title}>
            <span className={styles_module_css_1.default.highlight}>Revolutionize</span> <br />
            Your Fashion Store.
          </h1>
          <p className={styles_module_css_1.default.description}>
            The all-in-one platform for modern brands. Enable{' '}
            <strong>Virtual Try-On</strong> to boost sales, and generate{' '}
            <strong>Pro Lookbooks</strong> instantly without studio costs.
          </p>
          <div className={styles_module_css_1.default.actions}>
            <Link_1.default to="/" className={styles_module_css_1.default['primary-btn']}>
              Start Free Trial
            </Link_1.default>
            <Link_1.default to="#section2" className={styles_module_css_1.default['secondary-btn']}>
              Explore Solutions
            </Link_1.default>
          </div>
        </div>

        {/* CỘT PHẢI: Hình ảnh minh họa */}
        {/* CỘT PHẢI: Hình ảnh/Video minh họa */}
        <div className={styles_module_css_1.default['right-content']}>
          <video autoPlay /* Tự động chạy khi load trang */ loop /* Lặp lại liên tục */ muted /* Bắt buộc phải tắt tiếng thì trình duyệt mới cho autoPlay */ playsInline /* Hỗ trợ chạy mượt trên Safari/iPhone */ className={styles_module_css_1.default['mockup-image']} /* Giữ nguyên class này để video vừa khít cái khung */>
            <source src="/img/section1/IntroGarblo.mp4" type="video/mp4"/>
          </video>
        </div>
      </div>
    </section>);
}
