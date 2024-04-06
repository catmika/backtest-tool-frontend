import React, { useState, useEffect } from 'react';

export const Notification = ({ message, onClose }: { message: string | null; onClose?: () => void }) => {
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
      setShowNotification(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`notification transition-opacity duration-300 ease-in-out ${
        showNotification ? 'opacity-100' : 'hidden opacity-0'
      } fixed bottom-16 right-16 bg-gray-800 p-16 text-white`}
    >
      {message}
      <button
        className='ml-2 text-sm'
        onClick={() => {
          onClose && onClose();
          setShowNotification(false);
        }}
      >
        ✕
      </button>
    </div>
  );
};
