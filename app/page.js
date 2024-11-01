// In your app/page.js file or wherever you want to use the dynamic import

'use client'; // This makes the component a Client Component

import dynamic from 'next/dynamic';

const GlobeMap = dynamic(() => import('@/components/GlobeMap'), {
  ssr: false // This is now valid in a Client Component
});

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GlobeMap />
    </main>
  );
}
