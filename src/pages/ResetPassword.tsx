import { Button } from '@/components/Button';
import { useAppDispatch } from '@/store';
import { useResetPasswordMutation } from '@/store/api';
import React, { FormEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [resetPassword] = useResetPasswordMutation();

  const dispatch = useAppDispatch();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token') as string;

  const isPasswordSame = newPassword === confirmPassword;

  const onSubmit = async (e: FormEvent, password: string) => {
    e.preventDefault();
    try {
      isPasswordSame && (await resetPassword({ token, newPassword }));
    } catch (error) {
      // dispatch(showErrorNotification)
      console.log(error);
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <form onSubmit={(e) => onSubmit(e, newPassword)} className='flex flex-col gap-3'>
        <h1 className='text-2xl'>Enter your new password:</h1>
        <input className='text-black' type='password' placeholder='New password' onChange={(e) => setNewPassword(e.target.value)} />
        <input className='text-black' type='password' placeholder='Confirm new password' onChange={(e) => setConfirmPassword(e.target.value)} />
        {!isPasswordSame ? <p>Passwords must be the same</p> : <div className='h-6' />}
        <Button type='submit' disabled={!isPasswordSame}>
          Confirm
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
