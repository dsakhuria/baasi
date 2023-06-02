import Image from "next/image";
import AuthForm from "./components/AuthForm";

const Auth = () => {
  return (
    <div 
      className="
        flex 
        min-h-full 
        flex-col 
        justify-center 
        py-12 
        sm:px-6 
        lg:px-8 
        bg-[#111]
      "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          height="64"
          width="150"
          className="mx-auto w-auto mb-10"
          src="/images/logo2.png"
          alt="Logo"
        />
        <h2 
          className="
            mt-6 
            text-center 
            text-3xl 
            font-bold 
            tracking-tight 
            text-[#e1f5f2c1]
          "
          >
            Sign in or create an account
        </h2>
      </div>
      <AuthForm />      
  </div>
  )
}

export default Auth;
