import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-10 bg-white border border-gray-100 shadow-2xl shadow-gray-100">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-3">Onboarding</p>
          <h1 className="text-4xl font-black text-black tracking-tighter mb-2">Create Account</h1>
          <div className="h-1 w-12 bg-black mx-auto mt-4" />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
