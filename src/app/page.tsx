// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "@/context/store";
import Header from "@/components/layouts/Header";

export default function page() {
  // const users = useSelector((state: RootState) => state.user.users);
  // const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <Header />
      <h2 className="scroll-m-20 h-screen text-4xl font-semibold tracking-tight first:mt-0 flex justify-center items-center">
        Set up is Ready !!
      </h2>
    </>
  );
}
