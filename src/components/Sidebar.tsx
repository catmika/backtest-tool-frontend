import React, { Suspense } from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <Suspense>
      <div className='h-full w-56 bg-slate-950 p-6'>
        <nav className='flex flex-col gap-2'>
          <NavLink to='/about'>About</NavLink>
          <NavLink to='/dashboard'>Dashboard</NavLink>
        </nav>
      </div>
    </Suspense>
  );
};
