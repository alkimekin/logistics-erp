import { Avatar, Dropdown } from "flowbite-react";

import type { DrawerInterface } from "flowbite";

import { useRouter } from "next/router";

interface TopbarProps {
  userEmail: string;
  userRole: string;
  sidebarLabel: string;
  drawer?: DrawerInterface;
}

const Topbar = (props: TopbarProps) => {
  const router = useRouter();

  const handleLogout = (): void => {
    fetch(`/api/auth/logout`).then((res) => {
      if (res.status == 200) {
        router.push("/auth/login");
      }
    });
  };

  return (
    <nav className="fixed top-0 z-50 w-full h-16 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center w-full h-full px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between w-full h-full">
          <div className="flex items-center justify-start">
            <button
              onClick={() => props.drawer?.toggle()}
              data-drawer-target={props.sidebarLabel}
              data-drawer-toggle={props.sidebarLabel}
              aria-controls={props.sidebarLabel}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <a href="https://flowbite.com" className="flex ml-2 md:mr-24">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-3"
                alt="FlowBite Logo"
              />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Logistics ERP
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <Dropdown
              arrowIcon={false}
              inline={true}
              className="flex items-center ml-3"
              label={
                <Avatar
                  alt="User settings"
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  rounded={true}
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm text-gray-900 dark:text-white">
                  {props.userRole}
                </span>
                <span className="block text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                  {props.userEmail}
                </span>
              </Dropdown.Header>
              <Dropdown.Item>Panel</Dropdown.Item>
              <Dropdown.Item>Ayarlar</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Cikis Yap</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
