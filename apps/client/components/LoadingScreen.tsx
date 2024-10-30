'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  'Connecting to Solana...',
  'Authenticating Wallet...',
  'Loading Account...',
  'Fetching Transactions...',
  'Optimizing Experience...',
  'Finalizing Connection...',
];

const LoadingScreen = ({ isLoading }: { isLoading: boolean }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    if (!isLoading) return;

    const intervalId = setInterval(() => {
      setCurrentStep((prevStep) => {
        const nextStep = (prevStep + 1) % messages.length;
        setCurrentMessage(messages[nextStep]);
        return nextStep;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-2xl'>
      <div className='w-full max-w-3xl p-8 mx-4 rounded-xl'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className='flex items-center justify-center h-12'
          >
            <p className='text-lg text-gray-200'>{currentMessage}</p>
          </motion.div>
        </AnimatePresence>
        <div className='w-full h-2 mt-8 bg-gray-700 rounded-full'>
          <motion.div
            className='h-full rounded-full bg-brand'
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep + 1) / messages.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
