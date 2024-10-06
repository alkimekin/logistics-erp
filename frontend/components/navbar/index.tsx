import { useAppSelector } from "@/redux/hooks";

import Topbar from "./topbar";
import Sidebar from "./sidebar";

import "flowbite";

const Navbar = (props: any) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  return (
    <>
      <Topbar
        userEmail={currentUser ? currentUser.email : ""}
        userRole={currentUser ? currentUser.role : ""}
        sidebarLabel="logo-sidebar"
      />

      <Sidebar
        id="logo-sidebar"
        ariaLabel="logo-sidebar"
        userRole={currentUser ? currentUser.role : ""}
      />

      <div className="pt-16 sm:ml-64 bg-neutral-50 dark:bg-gray-900 min-h-screen">
        {props.children}
      </div>
    </>
  );
};

export default Navbar;
