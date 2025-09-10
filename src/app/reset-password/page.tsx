import ResetPasswordForm from './ResetPasswordForm';
import Header from '@/components/layouts/Header';

export default function ResetPasswordPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            Enter the OTP sent to your email and create a new password
                        </p>
                    </div>
                    <ResetPasswordForm />
                </div>
            </div>
        </>
    );
}
