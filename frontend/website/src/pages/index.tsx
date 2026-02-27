/* frontend/website/src/pages/index.tsx */
<<<<<<< HEAD
import React from 'react';
import Layout from '@theme/Layout';

// Import đầy đủ cả 2 Section ở đây
import Section1 from '@site/src/components/Home/section1';
import Section3 from '@site/src/components/Home/section3';
=======
import React from 'react'
import Layout from '@theme/Layout'
import Section1 from '@site/src/components/HomepageFeatures/section1' // Import khối Section 1 vào
import HowItWorks from '@site/src/components/HomepageFeatures/section2'
>>>>>>> cbb7a22 (feat(appConsumer): add virtual try-on section)

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Garblo - Reinvent Fashion"
      description="AI Fashion Infrastructure for Modern Brands">
      
      <main>
        <Section1 />
        <Section3 />
      </main>
      
    </Layout>
  );
}