/* frontend/website/src/pages/index.tsx */
<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react';
import Layout from '@theme/Layout';

// Import đầy đủ cả 2 Section ở đây
import Section1 from '@site/src/components/Home/section1';
import Section3 from '@site/src/components/Home/section3';
=======
import React from 'react'
import Layout from '@theme/Layout'
<<<<<<< HEAD
import Section1 from '@site/src/components/HomepageFeatures/section1' // Import khối Section 1 vào
import HowItWorks from '@site/src/components/HomepageFeatures/section2'
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)
=======
import Section1 from '@site/src/components/Home/section1' // Import khối Section 1 vào
import Section2 from '@site/src/components/Home/section2'
>>>>>>> 2fe9656 (refactor(website): change props of section2 component)
=======
import React from 'react';
import Layout from '@theme/Layout';

// Import đầy đủ cả 3 Section ở đây
import Section1 from '@site/src/components/Home/section1';
import Section2 from '@site/src/components/Home/section2';
import Section3 from '@site/src/components/Home/section3';
>>>>>>> e2378e7 (feat(website): add new sections to homepage)

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Garblo - Reinvent Fashion"
      description="AI Fashion Infrastructure for Modern Brands">
      
      <main>
        <Section1 />
<<<<<<< HEAD
<<<<<<< HEAD
        <Section3 />
=======

        {/* Sau này làm Section 2, 3 sẽ thêm vào đây */}
        <Section2 />
>>>>>>> 2fe9656 (refactor(website): change props of section2 component)
=======
        <Section2 />
        <Section3 />
>>>>>>> e2378e7 (feat(website): add new sections to homepage)
      </main>
      
    </Layout>
  );
}