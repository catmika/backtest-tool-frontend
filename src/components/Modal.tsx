import React, { MouseEvent, ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { useAppDispatch, useAppSelector } from '@/store';
import { setIsModalActive } from '@/store/slices/app.slice';

export const Modal = ({ children }: { children: ReactNode }) => {
  const [modalRoot] = useState(() => document.createElement('div'));
  const dispatch = useAppDispatch();
  const { isModalActive } = useAppSelector((state) => state.app);

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(setIsModalActive(false));
    }
  };

  const renderModalContent = () => (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50' onClick={handleOverlayClick}>
      <div className='bg-darkgreen z-50 rounded-lg p-8'>
        <button className='absolute right-4 top-4 cursor-pointer text-gray-500' onClick={() => dispatch(setIsModalActive(false))}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );

  useEffect(() => {
    document.body.appendChild(modalRoot);
    return () => {
      document.body.removeChild(modalRoot);
    };
  }, [modalRoot]);

  return isModalActive ? createPortal(renderModalContent(), modalRoot) : null;
};
