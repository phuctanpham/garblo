/* frontend/website/src/pages/index.tsx */
import React from 'react';
import Layout from '@theme/Layout';

// Import đầy đủ cả 3 Section ở đây
import Section1 from '@site/src/components/Home/section1';
import Section2 from '@site/src/components/Home/section2';
import Section3 from '@site/src/components/Home/section3';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Garblo - Reinvent Fashion"
      description="AI Fashion Infrastructure for Modern Brands">
      
      <main>
        <Section1 />
        <Section2 />
        <Section3 />
      </main>
      
    </Layout>
  );
}