import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <>
      <div className="min-h-[80vh] flex items-center justify-center bg-transparent px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
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
