import SignupForm from './SignupForm';
import Header from '@/components/layouts/Header';

export default function SignupPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-primary hover:text-primary/80">
                            Sign in here
                        </a>
                    </p>
                </div>
                <SignupForm />
            </div>
            </div>
        </>
    );
}
