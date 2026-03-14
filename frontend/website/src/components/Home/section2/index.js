"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Section2;
var react_1 = require("react");
var styles_module_css_1 = require("./styles.module.css");
// Component đếm số tự động
var AnimatedStat = function (_a) {
    var endValue = _a.endValue, _b = _a.suffix, suffix = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(0), value = _c[0], setValue = _c[1];
    var ref = (0, react_1.useRef)(null);
    var timerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (endValue === 0) {
            setValue(0);
            return;
        }
        var observer = new IntersectionObserver(function (_a) {
            var entry = _a[0];
            if (entry.isIntersecting) {
                var start_1 = 0;
                var duration = 2000;
                var step_1 = endValue / (duration / 16);
                timerRef.current = setInterval(function () {
                    start_1 += step_1;
                    if ((step_1 > 0 && start_1 >= endValue) || (step_1 < 0 && start_1 <= endValue)) {
                        setValue(endValue);
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    else {
                        setValue(Math.round(start_1));
                    }
                }, 16);
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        if (ref.current)
            observer.observe(ref.current);
        return function () {
            observer.disconnect();
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [endValue]);
    return (<h4 ref={ref}>
      {value}
      {suffix}
    </h4>);
};
function Section2() {
    return (<section id="section2" className={styles_module_css_1.default['section-container']}>
      <div className={styles_module_css_1.default['section-wrapper']}>
        {/* CỘT TRÁI: 3 Khối tính năng theo yêu cầu mới */}
        <div className={styles_module_css_1.default['features-list']}>
          <div className={styles_module_css_1.default['feature-card']}>
            <div className={styles_module_css_1.default['icon-box']}>✨</div>
            <div className={styles_module_css_1.default['feature-info']}>
              <h3>Instant Try-On</h3>
              <p>
                Shoppers upload a simple photo to virtually wear any item in
                your catalog in seconds.
              </p>
            </div>
          </div>

          <div className={styles_module_css_1.default['feature-card']}>
            <div className={styles_module_css_1.default['icon-box']}>📏</div>
            <div className={styles_module_css_1.default['feature-info']}>
              <h3>Size Confidence</h3>
              <p>
                Eliminate guesswork. Customers see exactly how the garment fits
                their unique body shape.
              </p>
            </div>
          </div>

          <div className={styles_module_css_1.default['feature-card']}>
            <div className={styles_module_css_1.default['icon-box']}>⚡</div>
            <div className={styles_module_css_1.default['feature-info']}>
              <h3>Seamless Integration</h3>
              <p>
                Deploy our plug-in to your e-commerce store in minutes. Zero
                complex coding required.
              </p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Nội dung và Số liệu đếm ngược */}
        <div className={styles_module_css_1.default['text-col']}>
          <div className={styles_module_css_1.default.subtitle}>Virtual Try-On Solution</div>

          <h2 className={styles_module_css_1.default.title}>
            Bring the Fitting Room <br />
            to Your Website.
          </h2>

          <p className={styles_module_css_1.default.description}>
            Shoppers abandon carts because they can't visualize the fit.
            Garblo's AI plug-in lets customers see themselves in your clothes
            instantly, transforming hesitation into purchase confidence.
          </p>

          <div className={styles_module_css_1.default['stats-grid']}>
            <div className={styles_module_css_1.default['stat-item']}>
              <AnimatedStat endValue={-83} suffix="%"/>
              <p>Cart Abandonment</p>
            </div>
            <div className={styles_module_css_1.default['stat-item']}>
              <AnimatedStat endValue={-20} suffix="%"/>
              <p>Return Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
