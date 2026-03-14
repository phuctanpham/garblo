"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Section3;
/* frontend/website/src/components/Home/section3/index.tsx */
var react_1 = require("react");
var styles_module_css_1 = require("./styles.module.css");
function Section3() {
    return (<section id="section3" className={styles_module_css_1.default['section-container']}>
      <div className={styles_module_css_1.default['section-wrapper']}>
        {/* CỘT TRÁI: Nội dung */}
        <div className={styles_module_css_1.default['text-col']}>
          <div className={styles_module_css_1.default.subtitle}>AI Lookbook Generation</div>

          <h2 className={styles_module_css_1.default.title}>
            Goodbye Studio Costs.
            <br />
            Hello Instant Lookbooks.
          </h2>

          <p className={styles_module_css_1.default.description}>
            Stop wasting weeks and thousands of dollars on photoshoots. Garblo's
            generative AI transforms simple flat-lay photos into stunning,
            studio-quality editorial images featuring diverse virtual models.
          </p>

          <ul className={styles_module_css_1.default['feature-list']}>
            <li>
              <span className={styles_module_css_1.default['check-icon']}>✔</span>
              Zero model or photographer fees
            </li>
            <li>
              <span className={styles_module_css_1.default['check-icon']}>✔</span>
              Generate multiple ethnicities and body types
            </li>
            <li>
              <span className={styles_module_css_1.default['check-icon']}>✔</span>
              Hyper-realistic 8K resolution output
            </li>
          </ul>
        </div>

        {/* CỘT PHẢI: Hình ảnh Before / After */}
        <div className={styles_module_css_1.default['image-col']}>
          {/* Ảnh Before (Chiếc áo chụp phẳng) */}
          <img src="img/section3/after-model.png" alt="Garment Flatlay Before" className={styles_module_css_1.default['img-before']}/>
          {/* Ảnh After (Người mẫu AI mặc chiếc áo đó) */}
          <img src="/img/section3/before-suit.png" alt="AI Generated Fashion Model" className={styles_module_css_1.default['img-after']}/>
        </div>
      </div>
    </section>);
}
