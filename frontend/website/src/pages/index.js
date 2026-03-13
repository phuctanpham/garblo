"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
/* frontend/website/src/pages/index.tsx */
var react_1 = require("react");
var Layout_1 = require("@theme/Layout");
// Import đầy đủ cả 3 Section ở đây
var section1_1 = require("@site/src/components/Home/section1");
var section2_1 = require("@site/src/components/Home/section2");
var section3_1 = require("@site/src/components/Home/section3");
function Home() {
    return (<Layout_1.default title="Garblo - Reinvent Fashion" description="AI Fashion Infrastructure for Modern Brands">
      
      <main>
        <section1_1.default />
        <section2_1.default />
        <section3_1.default />
      </main>
      
    </Layout_1.default>);
}
