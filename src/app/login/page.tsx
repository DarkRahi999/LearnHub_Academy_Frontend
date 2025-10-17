import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Or{" "}
              <a
                href="/signup"
                className="font-medium text-primary hover:text-primary/80"
              >
                create a new account
              </a>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
