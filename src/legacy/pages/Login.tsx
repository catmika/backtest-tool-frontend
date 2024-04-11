// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// import { useForgotPasswordMutation, useGetUserQuery, useSigninGoogleMutation, useSigninMutation, useSignupMutation } from '@/store/api';
// import { useAppDispatch } from '@/store';
// import { setIsModalActive } from '@/store/slices/app.slice';
// import { Button } from '@/components/Button';
// import { Loader } from '@/components/Loader';
// import { Tooltip } from '@/components/Tooltip';
// import { Modal } from '@/components/Modal';
// import { validateEmail, validatePassword } from '@/utils/helpers';

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const googleAuthRef = useRef(null);

//   const [email, setEmail] = useState('');
//   const [resetEmail, setResetEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const { data, isLoading } = useGetUserQuery();
//   const [signin] = useSigninMutation();
//   const [signinGoogle] = useSigninGoogleMutation();
//   const [signup] = useSignupMutation();
//   const [forgotPassword] = useForgotPasswordMutation();

//   const onSignin = async (e: React.FormEvent<HTMLFormElement>) => {
//     try {
//       e.preventDefault();
//       await signin({ email, password });
//       navigate('/about');
//     } catch (error) {
//       console.log(error);
//       // dispatch(showErrorNotification);
//     }
//   };

//   const onSignup = async () => {
//     try {
//       const isEmailValid = validateEmail(email);
//       if (!isEmailValid) {
//         console.log('idi nahuy');
//         return;
//       }
//       const isPasswordValid = validatePassword(password);
//       if (!isPasswordValid) {
//         return;
//       }
//       await signup({ email, password });
//     } catch (error) {
//       console.log(error);
//       // dispatch(showErrorNotification);
//     }
//   };

//   const onResetPassword = async (email: string) => {
//     try {
//       const isEmailValid = validateEmail(email);
//       if (!isEmailValid) {
//         console.log('idi nahuy');
//         return;
//       }
//       await forgotPassword({ email });
//     } catch (error) {
//       console.log(error);
//       // dispatch(showErrorNotification);
//     }
//   };

//   useEffect(() => {
//     if (googleAuthRef.current) {
//       (window as any).google.accounts.id.initialize({
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         callback: async (res: any, error: any) => {
//           try {
//             await signinGoogle({ credential: res.credential });
//             navigate('/about');
//             console.log(error);
//           } catch (error) {
//             // dispatch(showErrorNotification)
//             console.log(error);
//           }
//         },
//       });
//       (window as any).google.accounts.id.renderButton(googleAuthRef.current, {
//         size: 'large',
//         type: 'icon',
//         shape: 'circle',
//         use_fedcm_for_prompt: 'true',
//       });
//     }
//   }, [googleAuthRef.current, isLoading]);

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (data) {
//     navigate('/about');
//   }

//   return (
//     <section className='h-screen w-screen bg-slate-950'>
//       <div className='flex h-screen w-screen flex-col items-center justify-center'>
//         <div className='flex flex-row items-center justify-center'>
//           <h2 className='mb-0 mr-4 text-4xl'>Sign in with</h2>
//           <div ref={googleAuthRef} />
//         </div>

//         <div className=' my-4 flex w-3/5 items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300'>
//           <p className='mx-4 mb-0 text-center text-2xl font-semibold'>Or</p>
//         </div>

//         <form className='mb-5 flex w-3/5 flex-col items-center gap-6' onSubmit={(e) => onSignin(e)}>
//           <input
//             id='email'
//             type='text'
//             className='h-10 w-full rounded border bg-transparent p-2'
//             placeholder='Email address'
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <div className='group relative w-full'>
//             <input
//               type='password'
//               className='mb-2 h-10 w-full rounded border bg-transparent p-2'
//               id='password'
//               placeholder='Password'
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <Tooltip header='Password must:' text={['Be at least 8 and up to 64 characters long', 'Contain at least one numeric digit (0-9)']} />
//           </div>

//           <div className=' mb-6 flex w-full items-end justify-between gap-5'>
//             <div className='flex flex-col gap-3'>
//               <span>Don't have an account?</span>
//               <Button customStyle='h-1/2' type='button' onClick={onSignup}>
//                 SIGN UP
//               </Button>
//             </div>
//             <Button type='submit' customStyle='w-1/3 h-1/2'>
//               SIGN IN
//             </Button>
//           </div>
//         </form>

//         <a onClick={() => dispatch(setIsModalActive(true))} className='cursor-pointer underline'>
//           Forgot password?
//         </a>
//       </div>
//       <Modal>
//         <h3 className='mb-4 text-xl text-azure'>Enter your email</h3>
//         <input
//           type='text'
//           className='mb-5 h-10 w-full rounded border bg-transparent p-2 text-azure'
//           placeholder='Email address'
//           onChange={(e) => setResetEmail(e.target.value)}
//         />
//         <Button onClick={() => onResetPassword(resetEmail)}>Send resetting password link</Button>
//       </Modal>
//     </section>
//   );
// };

// export default Login;
