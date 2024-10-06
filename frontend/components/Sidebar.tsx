/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from "@headlessui/react";
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const navigation = [
  { name: "Anasayfa", icon: HomeIcon, current: false, href: "/" },
  {
    name: "Mal Kabul",
    icon: UsersIcon,
    current: false,
    children: [
      { name: "Genel Bakis", href: "/arrivals" },
      { name: "Yeni Kabul", href: "/arrivals/new" },
      { name: "Izleme Dosyasi Ata", href: "/arrivals/assignWatchFile" },
      { name: "Blokaji Kaldir", href: "/arrivals/unblock" },
      { name: "Depo Ici Transfer", href: "/arrivals/assignRack" },
      { name: "Biten Kabuller", href: "/arrivals/done" },
    ],
  },
  {
    name: "Siparis",
    icon: InboxIcon,
    current: false,
    children: [
      { name: "Genel Bakis", href: "/orders" },
      { name: "Siparis Hazirlama Emri", href: "/orders/prepare" },
    ],
  },
  {
    name: "Transfer",
    icon: FolderIcon,
    current: false,
    children: [
      { name: "Overview", href: "#" },
      { name: "Members", href: "#" },
      { name: "Calendar", href: "#" },
      { name: "Settings", href: "#" },
    ],
  },
  // {
  //   name: "Calendar",
  //   icon: CalendarIcon,
  //   current: false,
  //   children: [
  //     { name: "Overview", href: "#" },
  //     { name: "Members", href: "#" },
  //     { name: "Calendar", href: "#" },
  //     { name: "Settings", href: "#" },
  //   ],
  // },
  // {
  //   name: "Documents",
  //   icon: InboxIcon,
  //   current: false,
  //   children: [
  //     { name: "Overview", href: "#" },
  //     { name: "Members", href: "#" },
  //     { name: "Calendar", href: "#" },
  //     { name: "Settings", href: "#" },
  //   ],
  // },
  // {
  //   name: "Reports",
  //   icon: ChartBarIcon,
  //   current: false,
  //   children: [
  //     { name: "Overview", href: "#" },
  //     { name: "Members", href: "#" },
  //     { name: "Calendar", href: "#" },
  //     { name: "Settings", href: "#" },
  //   ],
  // },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}



const Sidebar = () => {
  return (
    <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto h-screen">
      <div className="flex items-center flex-shrink-0 px-4 w-52">
        <svg
          preserveAspectRatio="xMidYMid meet"
          data-bbox="0 0 1221.74 643.74"
          viewBox="0 0 1221.74 643.74"
          xmlns="http://www.w3.org/2000/svg"
          data-type="color"
          role="presentation"
          aria-hidden="true"
          aria-labelledby="svgcid-76oqs-jh2b40"
        >
          <title id="svgcid-76oqs-jh2b40"></title>
          <g>
            <path
              d="M328.08 374.26V271.64h24.08v39.41h16.69v-39.41h24.08v102.62h-24.08v-42.69h-16.69v42.69h-24.08Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="m399.78 374.26 22.44-102.62h29.01l22.3 102.62h-24.36l-3.42-19.98h-18.88L424 374.26h-24.22Zm36.94-84.01h-.27l-6.98 45.97h13.96l-6.7-45.97Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M480.65 374.26V271.64h24.08v41.05h.27l17.79-41.05h24.63l-21.89 45.29 23.26 57.33h-25.45l-13.27-35.71-5.34 10.4v25.31h-24.08Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="m551.94 374.26 22.44-102.62h29.01l22.3 102.62h-24.36l-3.42-19.98h-18.88l-2.87 19.98h-24.22Zm36.94-84.01h-.27l-6.98 45.97h13.96l-6.7-45.97Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="m653.6 316.79-.27.27 2.19 57.19h-22.85V271.63h24.77l18.61 57.33h.41l-2.33-57.33h22.85v102.62h-24.63l-18.75-57.47Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M742.14 374.26V271.64h24.08v82.1h29.42v20.52h-53.5Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M868.57 341.56c0 23.12-8.07 35.16-32.43 35.16s-32.84-12.04-32.84-35.16v-41.73c0-19.7 11.77-30.65 32.84-30.65s32.43 10.95 32.43 30.65v41.73Zm-24.08-40.09c0-6.29-.55-13.82-8.48-13.82s-8.62 7.53-8.62 13.82v42.14c0 5.88.96 14.64 8.76 14.64s8.35-8.76 8.35-14.64v-42.14Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M894.16 340.05v13c0 3.83 1.64 5.33 4.93 5.2 3.56-.14 4.79-.82 4.65-3.69l.14-82.92h24.08v71.42c0 7.25.41 15.19-3.15 22.03-5.06 9.44-14.09 11.63-24.49 11.63-11.49 0-21.48-5.47-24.36-16.97-1.23-4.65-1.1-9.3-1.1-13.82v-5.88h19.29Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M941.64 374.26V271.64h24.08v102.62h-24.08Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M997.19 339.91v7.25c0 5.88 1.92 11.08 9.58 11.08 5.61 0 8.07-5.06 8.07-10.26 0-8.62-7.12-11.9-13.41-15.73-7.39-4.24-13.68-8.21-18.2-13.41-4.38-5.2-6.98-11.49-6.98-20.52 0-19.29 11.63-29.14 30.24-29.14 20.93 0 31.61 13.96 30.51 33.25h-22.16c-.27-6.02 0-14.23-7.94-14.78-4.93-.41-7.8 2.33-8.35 6.84-.68 6.16 2.46 9.3 7.25 12.59 9.03 5.75 16.83 9.3 22.44 14.5 5.61 5.2 8.89 12.04 8.89 24.49 0 19.7-10.95 30.65-30.92 30.65-22.03 0-31.33-12.32-31.33-25.86v-10.95h22.3Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M1044.13 271.64h62.39v20.52h-19.43v82.1h-24.08v-82.1h-18.88v-20.52Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M1116.51 374.26V271.64h24.08v102.62h-24.08Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M1153.6 374.26V271.64h24.08v41.05h.27l17.79-41.05h24.63l-21.89 45.29 23.26 57.33h-25.45l-13.27-35.71-5.34 10.4v25.31h-24.08Z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M965.72 242.06v24.08h-24.08v-24.08h24.08z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M1140.59 242.06v24.08h-24.08v-24.08h24.08z"
              fill="#000000"
              data-color="1"
            ></path>
            <path
              d="M571.07 403.92c-3.24 9.83-7.03 19.41-11.37 28.69h-41.99c3.45-9.32 6.43-18.9 8.96-28.69h-7.93c-2.6 9.71-5.69 19.3-9.3 28.69h-76.86c2.08-9.32 3.88-18.91 5.42-28.69h-7.48c-1.57 9.73-3.41 19.32-5.55 28.69h-99.38v-28.69h-7.44v28.69h-99.38c-7.83-34.31-11.81-71.42-12.1-108.51h103.32v-7.44H206.66c.09-16.14.86-32.23 2.33-48.04 1.98-21.41 5.1-41.63 9.23-60.47h99.92v30.71h7.44v-30.71h99.92c2.16 9.86 4.04 20.12 5.63 30.71h7.52c-1.56-10.53-3.4-20.79-5.54-30.71h74.42c3.93 10.06 7.31 20.33 10.17 30.71h7.87c-2.79-10.49-6.1-20.75-9.89-30.71h42.62a260.31 260.31 0 0 1 12.47 30.71h62.19c-14.36-54.2-42.8-103.88-83.5-144.59C488.67 33.48 407.85 0 321.87 0s-166.8 33.48-227.6 94.27C33.48 155.07 0 235.9 0 321.87s33.48 166.8 94.27 227.6c60.79 60.79 141.62 94.27 227.6 94.27s166.8-33.48 227.6-94.27c40.94-40.94 69.47-90.98 83.75-145.55h-62.15ZM431.43 200.71c-6.64-28.42-15.66-54.01-26.81-75.74-1.67-3.26-3.39-6.4-5.14-9.45h47.53c24.89 23.7 44 53.2 57.51 85.19h-73.08Zm123.11 0h-41.79c-9.36-22.76-21.33-43.85-35.65-62.55-6.2-8.09-12.76-15.64-19.66-22.64h26.33c29.22 22.97 53.44 52.01 70.79 85.19Zm-80.72-92.63h-24.08c-19.1-17.63-40.57-31.27-63.95-40.7 32.08 8.06 61.83 22.03 88.02 40.7Zm-35.04 0h-43.79c-12.04-19.01-25.82-33.49-40.92-43.03 33 7.72 61.2 22.88 84.71 43.03ZM325.59 60.89c22.73 5.4 43.26 21.88 60.33 47.19h-60.33V60.9Zm0 54.62h65.09c13.84 22.74 25.14 51.6 33.14 85.19H325.6v-85.18ZM220.45 467.07c7.04 21.92 15.58 41.35 25.46 58.15h-50.14c-25.83-24.11-45.16-53.4-58.46-85.19h75.59c2.25 9.32 4.77 18.36 7.56 27.04Zm-9.29-34.48H134.3c-13.33-34.64-19.71-71.93-19.76-108.51h84.73c.32 37.64 4.38 74.78 11.89 108.51Zm-9.57-164.68a557.162 557.162 0 0 0-2.33 48.73h-84.64c.05-2.29.12-4.57.22-6.85 1.49-33.84 8.55-68.89 21.36-101.66h74.42c-4.06 18.85-7.1 38.87-9.03 59.78Zm10.72-67.22h-73.08c13.5-31.99 32.62-61.49 57.51-85.19h47.53c-1.75 3.05-3.47 6.19-5.14 9.45-11.15 21.73-20.17 47.32-26.81 75.74Zm105.84 0h-98.22c8-33.59 19.29-62.45 33.13-85.19h65.09v85.19Zm0-92.63h-60.33c17.07-25.3 37.6-41.79 60.33-47.19v47.19Zm-69.4 0h-43.79c23.51-20.16 51.7-35.31 84.71-43.03-15.1 9.55-28.88 24.02-40.92 43.03Zm9.19-40.7c-23.38 9.43-44.85 23.07-63.95 40.7h-24.07c26.19-18.67 55.95-32.64 88.02-40.7Zm-97.96 48.14h26.32c-6.9 7-13.46 14.55-19.66 22.64-14.32 18.69-26.29 39.79-35.65 62.55H89.2c17.35-33.18 41.57-62.22 70.79-85.19Zm-74.54 92.63h42.62c-11.99 31.48-19.09 65.88-20.65 101.34-.11 2.39-.18 4.79-.23 7.17H59.56c.76-38.8 9.97-75.56 25.88-108.51ZM59.52 324.08h47.58c0 38.03 6.5 74.95 18.94 108.51H84.05c-15.44-33.03-24.2-69.78-24.52-108.51Zm28.14 115.95h41.26c7.03 17.46 15.69 33.93 25.92 49.08 8.89 13.17 18.87 25.21 29.83 36.11h-28.38c-28.42-23.18-51.91-52.19-68.63-85.19Zm78.17 92.63h26.66c21.64 19.61 46.79 35.01 74.9 45.87-37.4-7.93-71.88-23.84-101.57-45.87Zm38.31 0h46.34c12.89 20.04 27.87 35.87 44.67 47.18-36.02-9.82-66.23-26.23-91.01-47.18Zm114.01 51.31c-23.36-10.02-42.89-27.94-58.73-51.31h58.73v51.31Zm0-58.75h-63.53c-14.88-24.14-26.19-53.33-34.09-85.19h97.61v85.19Zm112.69-85.19h75.59c-13.31 31.79-32.64 61.08-58.46 85.19h-50.14c9.88-16.8 18.42-36.23 25.46-58.15 2.79-8.68 5.31-17.72 7.56-27.04Zm-105.26 0h97.61c-7.89 31.87-19.21 61.05-34.09 85.19h-63.53v-85.19Zm0 92.63h58.73c-15.85 23.38-35.38 41.3-58.73 51.31v-51.31Zm67.67 0h46.34c-24.78 20.94-54.99 37.36-91.01 47.18 16.8-11.31 31.78-27.14 44.67-47.18Zm-16.91 45.87c28.12-10.86 53.27-26.26 74.9-45.87h26.66c-29.69 22.03-64.17 37.95-101.57 45.87Zm111.12-53.31h-28.38c10.96-10.9 20.94-22.94 29.83-36.11 10.22-15.15 18.89-31.62 25.92-49.08h41.26c-16.72 33-40.2 62.01-68.63 85.19Z"
              fill="#ce0026"
              data-color="2"
            ></path>
          </g>
        </svg>
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1 bg-white" aria-label="Sidebar">
          {navigation.map((item) =>
            !item.children ? (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </div>
            ) : (
              <Disclosure as="div" key={item.name} className="space-y-1">
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        item.current
                          ? "bg-gray-100 text-gray-900"
                          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      )}
                    >
                      <item.icon
                        className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.name}</span>
                      <svg
                        className={classNames(
                          open ? "text-gray-400 rotate-90" : "text-gray-300",
                          "ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                        )}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                      </svg>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-1">
                      {item.children.map((subItem) => (
                        <Disclosure.Button
                          key={subItem.name}
                          as={Link}
                          href={subItem.href}
                          className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                        >
                          {subItem.name}
                        </Disclosure.Button>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
