import { useAppSelector } from "@/redux/hooks";
import product, { productSlice } from "@/redux/slices/product";
import { Disclosure } from "@headlessui/react";
import { Pagination } from "flowbite-react";
import { FormEvent, useEffect, useState } from "react";

const AllParcelsTable = () => {
  const products = useAppSelector((state) => state.product.products);
  const baseProducts = useAppSelector((state) => state.product.baseProducts);
  const parcels = useAppSelector((state) => state.storage.parcels);
  console.log(parcels);

  const postsPerPage = 50;

  const [totalPages, setTotalPages] = useState(
    Math.ceil(product.length / postsPerPage)
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [currentParcels, setCurrentParcels] = useState(parcels);
  const [displayedParcels, setDisplayedParcels] = useState(
    currentParcels.slice(0, postsPerPage)
  );

  const [parcelId, setParcelId] = useState("");
  const [paletteId, setPaletteId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("-1");

  const handleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      parcels
        .filter((parcel) => {
          return parcelId != "" ? parcel.id == parcelId : true;
        })
        .filter((parcel) => {
          return orderId != "" ? parcel.orderId == parseInt(orderId) : true;
        })
        .filter((parcel) => {
          return paletteId != "" ? parcel.paletteId == paletteId : true;
        })
        .filter((parcel) => {
          return status != "-1" ? parcel.status == status : true;
        })
    );
    setCurrentParcels(
      parcels
        .filter((parcel) => {
          return parcelId != "" ? parcel.id == parcelId : true;
        })
        .filter((parcel) => {
          return orderId != "" ? parcel.orderId == parseInt(orderId) : true;
        })
        .filter((parcel) => {
          return paletteId != "" ? parcel.paletteId == paletteId : true;
        })
        .filter((parcel) => {
          return status != "-1" ? parcel.status == status : true;
        })
    );
  };

  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(Math.ceil(currentParcels.length / postsPerPage));
    setDisplayedParcels(currentParcels.slice(0, postsPerPage));
  }, [currentParcels]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <Disclosure>
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg ">
            <div className="w-full flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 p-4">
              {/*Search*/}
              <div className="w-full md:w-1/2">
                <form className="min-w-[170px] flex items-center">
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

              <Disclosure.Button
                as="button"
                role="button"
                className="w-1/2 min-w-[100px] md:w-1/6 flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
              </Disclosure.Button>
            </div>

            <Disclosure.Panel
              as="div"
              className="w-fit lg:w-full border-b-2 border-t dark:border-gray-700 dark:bg-gray-800"
            >
              <form onSubmit={(e) => handleFilterSubmit(e)}>
                <div className="grid py-6 lg:grid-cols-4 px-6">
                  <div className="min-w-[150px] col-span-1 mb-6 px-4 lg:py-3">
                    <label
                      htmlFor="parcelId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Koli Numarası
                    </label>
                    <input
                      type="text"
                      id="parcelId"
                      name="parcelId"
                      value={parcelId}
                      onChange={(e) => setParcelId(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="min-w-[150px] col-span-1 mb-6 px-4 lg:py-3">
                    <label
                      htmlFor="paletteId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Palet Numarası
                    </label>
                    <input
                      type="text"
                      id="paletteId"
                      name="paletteId"
                      value={paletteId}
                      onChange={(e) => setPaletteId(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="min-w-[150px] col-span-1 mb-6 px-4 lg:py-3">
                    <label
                      htmlFor="orderId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Sipariş Numarası
                    </label>
                    <input
                      type="text"
                      id="orderId"
                      name="orderId"
                      value={orderId}
                      onChange={(e) => setOrderId(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-1 min-w-[150px] col-span-1 mb-6 px-4 lg:py-3">
                    <label
                      htmlFor="status"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Aşama
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={status}
                      onChange={(e) => setStatus(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="-1"> - - - - - - - - - - - - - -</option>
                      <option value="ON_RACK" className="">
                        Rafta
                      </option>
                      <option value="ON_FLOOR">Yer</option>
                      <option value="ON_SECONDERY">Sekonder</option>
                      <option value="ON_PREPARATION">Hazırlama</option>
                      <option value="ON_TRANSFER">Transfer</option>
                      <option value="DELIVERED">İletildi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-8 px-4 pb-6 gap-3 justify-items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();

                      setCurrentParcels(parcels);
                      setStatus("-1");
                      setPaletteId("");
                      setParcelId("");
                      setOrderId("");
                    }}
                    className="min-w-[70px] col-start-2 xl:col-start-7 px-5 py-2.5 mr-0 mb-2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Temizle
                  </button>
                  <button
                    type="submit"
                    className="min-w-[70px] col-start-7 xl:col-start-8 px-5 py-2.5 mr-0 mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Uygula
                  </button>
                </div>
              </form>
            </Disclosure.Panel>

            <div className="overflow-auto">
              <div className="flex flex-col justify-center items-center  w-fit min-w-[700px] text-sm text-left text-gray-500 dark:text-gray-400">
                <div className="grid grid-flow-col auto-cols-[minmax(155px,1000px)] font-bold text-xs text-gray-700 uppercase text-center tracking-wider bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <div className="col-span-1 px-4 py-3 ">Koli No</div>
                  <div className="col-span-1 px-4 py-3">Ürün Adedi</div>
                  <div className="col-span-1 px-4 py-3">Palet No</div>
                  <div className="col-span-1 px-4 py-3">Sipariş No</div>
                  <div className="col-span-1  px-4 py-3">Aşama</div>
                </div>

                {/* <div>{displayedProducts.length}</div> */}

                {displayedParcels.map((parcel, parcelIndex) => (
                  <div
                    key={`parcel-${parcelIndex}`}
                    className="grid grid-flow-col auto-cols-[minmax(155px,1000px)] w-full text-center gap-6 border-b dark:border-gray-700"
                  >
                    <div className="col-span-1 px-4 py-3 self-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="grid grid-cols-5">
                        <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                          {parcel.id}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      {parcel.products == null ? 0 : parcel.products.length}
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      {parcel.paletteId}
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      {parcel.orderId}
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                        {parcel.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <nav
              className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
              aria-label="Table navigation"
            >
              <span className="flex flex-row space-x-1 text-sm font-normal text-gray-500 dark:text-gray-400"></span>
              <Pagination
                currentPage={currentPage}
                onPageChange={(n) => {
                  setDisplayedParcels(
                    currentParcels.slice(
                      (n - 1) * postsPerPage,
                      n * postsPerPage
                    )
                  );
                  setCurrentPage(n);
                }}
                showIcons
                totalPages={totalPages}
                nextLabel=""
                previousLabel=""
              />
            </nav>
          </div>
        </Disclosure>
      </div>
    </section>
  );
};

export default AllParcelsTable;
