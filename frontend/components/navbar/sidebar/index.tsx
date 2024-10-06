import { Disclosure } from "@headlessui/react";
import {
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { DrawerInterface } from "flowbite";
import Link from "next/link";

const navigation = [
  {
    name: "Anasayfa",
    icon: HomeIcon,
    current: false,
    roles: ["USER", "LIFTER", "ADMIN", "SERVICE_ACCOUNT"],
    href: "/",
  },
  {
    name: "Is Emirleri (Forklift)",
    icon: HomeIcon,
    current: false,
    roles: ["LIFTER", "SERVICE_ACCOUNT"],
    href: "/forklift/workOrders",
  },
  {
    name: "Stok",
    icon: UsersIcon,
    current: false,
    roles: ["ADMIN", "SERVICE_ACCOUNT"],
    children: [
      { name: "Genel Bakış", href: "/stock" },
      { name: "Tum Paletler", href: "/stock/palettes/all" },
      { name: "Tum Koliler", href: "/stock/parcels/all" },
      { name: "Tum Urunler", href: "/stock/products/all" },
      { name: "Palet Konumlandir", href: "/stock/transfer" },
    ],
  },
  {
    name: "Mal Kabul",
    icon: UsersIcon,
    current: false,
    roles: ["ADMIN", "SERVICE_ACCOUNT"],
    children: [
      { name: "Genel Bakış", href: "/arrivals" },
      { name: "Yeni Kabul", href: "/arrivals/new" },
      { name: "İzleme Dosyası Ata", href: "/arrivals/assignWatchFile" },
      { name: "Blokaji Kaldır", href: "/arrivals/unblock" },
      { name: "Depo İçi Transfer", href: "/arrivals/assignRack" },
    ],
  },
  {
    name: "Sipariş",
    icon: InboxIcon,
    current: false,
    roles: ["ADMIN", "SERVICE_ACCOUNT"],
    children: [
      { name: "Genel Bakış", href: "/orders" },
      { name: "Tum Siparisler", href: "/orders/all" },
      { name: "Sipariş Hazırlama Emri", href: "/orders/prepare" },
    ],
  },
  {
    name: "Transfer",
    icon: FolderIcon,
    current: false,
    roles: ["ADMIN", "SERVICE_ACCOUNT"],
    children: [
      { name: "Overview", href: "#" },
      { name: "Members", href: "#" },
      { name: "Calendar", href: "#" },
      { name: "Settings", href: "#" },
    ],
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface SidebarProps {
  id: string;
  ariaLabel: string;
  drawer?: DrawerInterface;
  userRole: string;
}

const Sidebar = (props: SidebarProps) => {
  return (
    <aside
      id={props.id}
      aria-label={props.ariaLabel}
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flex flex-col h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800 space-y-2 font-medium">
        {navigation.map((item) =>
          item.roles.includes(props.userRole) ? (
            !item.children ? (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => props.drawer?.hide()}
                  className="flex flex-row items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <item.icon
                    className="w-6 h-6 mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </div>
            ) : (
              <Disclosure as="div" key={item.name} className="space-y-1">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex items-center justify-between w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex flex-row">
                        <item.icon
                          className="w-6 h-6 mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                          aria-hidden="true"
                        />
                        <span className="flex-1">{item.name}</span>
                      </div>

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
                          onClick={() => props.drawer?.hide()}
                          className="flex items-center pl-11 pr-2 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {subItem.name}
                        </Disclosure.Button>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          ) : (
            <></>
          )
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
