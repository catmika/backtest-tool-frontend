import React from 'react';

export const Tooltip = ({ header, text, customStyle }: { header: string; text?: string[]; customStyle?: string }) => {
  return (
    <div
      className={`invisible absolute bottom-8 left-1/4 top-full z-10 h-max w-max -translate-x-1/2 transform rounded-lg bg-black bg-opacity-80 p-2 px-4 py-2 text-xs text-white opacity-0 group-hover:visible group-hover:opacity-100 ${customStyle}`}
    >
      <strong>{header}</strong>
      <ul className='ml-4 list-disc'>
        {text?.map((item, i) => {
          return <li key={i}>{item}</li>;
        })}
      </ul>
    </div>
  );
};
