import Header from "@/components/layouts/Header";
import ProfileForm from "./ProfileForm";

export default function page() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
        <ProfileForm />
      </div>
    </>
  );
}
