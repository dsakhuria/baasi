'use client';

import axios from "axios";
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BsGithub, BsGoogle  } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";

import Input from "@/app/components/inputs/Input";
import AuthSocialButton from './AuthSocialButton';
import Button from "@/app/components/Button";
import { toast } from "react-hot-toast";

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/conversations')
      toast.success("Logged in. (redirecting...)")
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {    
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
  
    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
      .then(() => signIn('credentials', {
        ...data,
        redirect: false,
      }))
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations')
          toast.success("Registered. (redirecting...)")

        }
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false))
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false
      })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations')
        }
      })
      .finally(() => setIsLoading(false))
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations')
          toast.success("Logged in using social provider. (redirecting...)")
        }
      }) 
      .finally(() => setIsLoading(false));
  } 

  return ( 
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div 
        className="
        bg-[#2a2a2a]
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form 
          className="space-y-6" 
          onSubmit={handleSubmit(onSubmit)}
        >
          {variant === 'REGISTER' && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="name" 
              label="Name"
            />
          )}
          <Input 
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="email" 
            label="Email address" 
            type="email"
          />
          <Input 
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="password" 
            label="Password" 
            type="password"
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div 
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-none" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-none px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton 
              icon={BsGithub} 
              onClick={() => socialAction('github')} 
            />
            <AuthSocialButton 
              icon={BsGoogle} 
              onClick={() => socialAction('google')} 
            />
          </div>
        </div>
        <div 
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>
            {variant === 'LOGIN' ? 'New to Baasi?' : 'Already an Baasi member?'} 
          </div>
          <div 
            onClick={toggleVariant} 
            className="
            underline 
            cursor-pointer
            hover:text-[#787bb2]"
          >
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default AuthForm;
