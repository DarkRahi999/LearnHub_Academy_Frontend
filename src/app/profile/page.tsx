import ProtectedRoute from "@/auth/root";

export default function page() {
  return (
    <ProtectedRoute roles={["viewer", "editor"]}>
      <h2 className="scroll-m-20 h-screen text-4xl font-semibold tracking-tight first:mt-0 flex justify-center items-center">
        This is User profile !!
      </h2>
    </ProtectedRoute>
  );
}
