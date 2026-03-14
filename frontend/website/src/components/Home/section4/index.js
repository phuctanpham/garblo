"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Section4;
/* frontend/website/src/components/Home/section4/index.tsx */
var react_1 = require("react");
var styles_module_css_1 = require("./styles.module.css");
function Section4() {
    return (<section id="section4" className={styles_module_css_1.default['section-container']}>
      <div className={styles_module_css_1.default['section-wrapper']}>
        <div className={styles_module_css_1.default.subtitle}>Get Early Access</div>
        <h2 className={styles_module_css_1.default.title}>
          Ready to Revolutionize <br /> Your Brand?
        </h2>
        <p className={styles_module_css_1.default.description}>
          Join the waitlist today to experience Garblo's Virtual Try-On and AI
          Lookbook tools. We'll get back to you within 24 hours.
        </p>

        {/* Khối Form gửi dữ liệu */}
        <div className={styles_module_css_1.default['form-card']}>
          <form action="https://formspree.io/f/myknpynz" method="POST">
            <div className={styles_module_css_1.default['form-group']}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" className={styles_module_css_1.default['form-input']} placeholder="e.g. John Doe" required/>
            </div>

            <div className={styles_module_css_1.default['form-group']}>
              <label htmlFor="email">Work Email</label>
              <input type="email" id="email" name="email" className={styles_module_css_1.default['form-input']} placeholder="john@yourbrand.com" required/>
            </div>

            <div className={styles_module_css_1.default['form-group']}>
              <label htmlFor="brand">Brand Name / Website</label>
              <input type="text" id="brand" name="brand" className={styles_module_css_1.default['form-input']} placeholder="www.yourbrand.com" required/>
            </div>

            <button type="submit" className={styles_module_css_1.default['submit-btn']}>
              Start Free Trial
            </button>
          </form>
        </div>
      </div>
    </section>);
}
