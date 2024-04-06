import React, { FC, ReactNode } from 'react';
import { Loader } from './Loader';

interface IButton {
  children?: string | number | ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  customStyle?: string;
}

export const Button: FC<IButton> = ({ children, onClick, type = 'button', disabled = false, loading, customStyle }) => {
  return (
    <button
      className={`rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 ${disabled && 'cursor-not-allowed opacity-50'} ${customStyle}`}
      onClick={loading ? () => null : onClick}
      type={type}
      disabled={disabled}
    >
      {loading ? <Loader /> : children}
    </button>
  );
};
