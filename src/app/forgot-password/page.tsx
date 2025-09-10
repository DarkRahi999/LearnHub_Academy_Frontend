import ForgotPasswordForm from './ForgotPasswordForm';
import Header from '@/components/layouts/Header';

export default function ForgotPasswordPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                            Forgot Password
                        </h2>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            Enter your email address and we&apos;ll send you an OTP to reset your password
                        </p>
                    </div>
                    <ForgotPasswordForm />
                </div>
            </div>
        </>
    );
}
