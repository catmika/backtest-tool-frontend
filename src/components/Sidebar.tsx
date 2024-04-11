import React, { Suspense, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/store';
import { logout } from '@/store/api';
import Button from './Button';

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const onLogout = async () => {
    setIsLoading(true);
    await dispatch(logout(navigate) as any);
    setIsLoading(false);
  };

  return (
    <Suspense>
      <div className='h-full w-56 bg-slate-950 p-6'>
        <nav className='flex flex-col gap-2'>
          <NavLink to='/about'>About</NavLink>
          <NavLink to='/dashboard'>Dashboard</NavLink>
        </nav>
        <Button fullWidth variant='contained' isLoading={isLoading} onClick={onLogout}>
          Logout
        </Button>
      </div>
    </Suspense>
  );
};
