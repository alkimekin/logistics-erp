import { BaseProduct, Order } from "@/types";
import { Disclosure } from "@headlessui/react";

interface AllOrdersTableProps {
  baseProducts: BaseProduct[];
  orders: Order[];
}

const AllOrdersTable = (props: AllOrdersTableProps) => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-auto">
          <div className="overflow-auto min-w-[700px] grid grid-cols-6 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            {/*Search*/}
            <div className="w-full col-span-2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    required
                  />
                </div>
              </form>
            </div>

            <button
              id="filterDropdownButton"
              data-dropdown-toggle="filterDropdown"
              className="col-span-1 w-full md:w-3/4 flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-4 w-4 mr-2 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              Filter
              <svg
                className="-mr-1 ml-1.5 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
              </svg>
            </button>

            {/*Siparis Olustur*/}
            <div className="col-span-3"></div>
          </div>

          <div className="flex flex-col justify-center items-center overflow-auto w-full min-w-[700px] text-sm text-left text-gray-500 dark:text-gray-400">
            <div className="grid grid-cols-5 w-full gap-6 font-bold text-xs text-gray-700 uppercase text-center tracking-wider bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <div className="col-span-1 px-4 py-3">
                <div className="grid grid-cols-5">
                  <div className="col-span-2  col-start-3 ">Siparis Id</div>
                </div>
              </div>

              <div className="col-span-1 px-4 py-3">Asamasi</div>

              <div className="col-span-1 px-4 py-3">Sirket Adi</div>

              <div className="col-span-1 px-4 py-3">
                <div className="flex items-center">
                  Siparis Tarihi
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 ml-1"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="col-span-1 px-4 py-3">Goruntule</div>
            </div>

            {props.orders?.map((order, orderIndex) => (
              <Disclosure key={`order-${orderIndex}`}>
                <div className="grid grid-cols-5 w-full text-center gap-6 border-b dark:border-gray-700">
                  <div className="col-span-1 px-4 py-3 self-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="grid grid-cols-5">
                      <Disclosure.Button
                        as="button"
                        role="button"
                        className="col-span-1"
                      >
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          focusable="false"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </Disclosure.Button>

                      <div className="col-span-1 col-start-3 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                        {order.id}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                      {order.status}
                    </span>
                  </div>

                  <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    {order.companyName || "null"}
                  </div>

                  <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    Tarih
                  </div>
                  <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    <p className="text-gray-500 dark:text-gray-400">
                      <a
                        href="#"
                        className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Goruntule
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </a>
                    </p>
                  </div>
                </div>

                <Disclosure.Panel
                  as="div"
                  className="w-full border-b-2 border-t dark:border-gray-700 dark:bg-gray-800"
                >
                  <Disclosure.Panel
                    as="div"
                    className="grid grid-cols-5 gap-3 py-4 w-full text-sm text-left text-red-800 tracking-wider bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  >
                    <div className="col-span-1 px-6 text-gray-400 font-medium text-center">
                      Irsaliye No
                    </div>
                    <div className="col-span-1 px-6 text-gray-400 font-medium text-center">
                      Urun Adi
                    </div>
                    <div className="col-span-1 px-6 text-gray-400 font-medium text-center">
                      Urun Adedi
                    </div>
                    <div className="col-span-1 px-6 text-gray-400 font-medium text-center">
                      Lot Numarasi
                    </div>
                  </Disclosure.Panel>

                  {order.dispatchNotes?.map((note) =>
                    note.products?.map((product, productIndex) => (
                      <Disclosure.Panel
                        key={`dispatchProduct-${productIndex}`}
                        as="div"
                        className="w-full grid grid-cols-5 gap-6"
                      >
                        <div className="col-span-1 px-9 py-3 self-center text-center">
                          {note.invoiceNumber}
                        </div>
                        <div className="col-span-1 px-9 py-3 self-center text-center">
                          {
                            props.baseProducts.filter(
                              (p: BaseProduct) => p.id == product.baseProductId
                            )[0].name
                          }
                        </div>
                        <div className="col-span-1 px-9 py-3 self-center text-center">
                          {product.count}
                        </div>
                        <div className="col-span-1 px-9 py-3 self-center text-center">
                          {product.lotNumber}
                        </div>
                      </Disclosure.Panel>
                    ))
                  )}
                </Disclosure.Panel>
              </Disclosure>
            ))}
          </div>

          <nav
            className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
            aria-label="Table navigation"
          >
            <span className="flex flex-row space-x-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              <span className="text-gray-900 dark:text-white">Showing</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                1-10
              </span>
              <span className="text-gray-900 dark:text-white">of</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                1000
              </span>
            </span>
            <ul className="inline-flex items-stretch -space-x-px">
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-current="page"
                  className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  ...
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  100
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default AllOrdersTable;
