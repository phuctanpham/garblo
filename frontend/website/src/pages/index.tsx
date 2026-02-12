/* frontend/website/src/pages/index.tsx */
import React from 'react'
import Layout from '@theme/Layout'
import Section1 from '@site/src/components/Section1' // Import khối Section 1 vào

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Garblo - Reinvent Fashion"
      description="AI Fashion Infrastructure for Modern Brands"
    >
      <main>
        {/* Hiển thị Section 1 */}
        <Section1 />

        {/* Sau này làm Section 2, 3 sẽ thêm vào đây */}
      </main>
    </Layout>
  )
}
