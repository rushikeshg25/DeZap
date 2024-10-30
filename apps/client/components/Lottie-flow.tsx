'use client';
import flow from '@/lottie/flow.json';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function Flow() {
  return (
    <Lottie
      animationData={flow}
      loop
      autoPlay
      rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
      className="h-[300px] w-[300px] self-center"
    />
  );
}
