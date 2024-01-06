import React from 'react';
import { Svg } from '@/components/Svg';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <section className='h-screen w-screen bg-slate-950'>
      <form className='flex h-screen w-screen flex-col items-center justify-center'>
        <div className='flex flex-row items-center justify-center'>
          <p className='mb-0 mr-4 text-lg'>Sign in with</p>

          <button className='mr-5'>
            <Svg icon='facebook' />
          </button>

          <button className='mr-5'>
            <Svg icon='twitter' />
          </button>

          <button className='mr-5'>
            <Svg icon='linkedin' />
          </button>
        </div>

        <div className=' my-4 flex w-3/5 items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300'>
          <p className='mx-4 mb-0 text-center font-semibold'>Or</p>
        </div>

        <div className='relative mb-6 w-3/5'>
          <input id='email' type='text' className='w-full border border-current bg-transparent' placeholder='Email address' />
          {/* <label htmlFor='email' className=''>
            Email address
          </label> */}
        </div>

        <div className='relative mb-6 w-3/5'>
          <input type='password' className='w-full border border-current bg-transparent' id='password' placeholder='Password' />
          {/* <label htmlFor='password' className=''>
            Password
          </label> */}
        </div>

        <div className='mb-6 flex w-3/5 justify-between'>
          <div>
            <input className='' type='checkbox' value='' id='rememberMe' />
            <label className='hover:cursor-pointer' htmlFor='rememberMe'>
              Remember me
            </label>
          </div>
          <a href='#!' className='underline'>
            Forgot password?
          </a>
        </div>

        <div className='flex w-3/5 flex-col'>
          <button type='button' className='mb-5 underline' onClick={() => navigate('/')}>
            LOGIN
          </button>

          <div className='text-center'>
            Don't have an account?
            <br />
            <a href='#!' className='underline'>
              REGISTER
            </a>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Login;
