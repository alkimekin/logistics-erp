import { useAppSelector } from "@/redux/hooks";
import product, { productSlice } from "@/redux/slices/product";
import { Product, Order, BaseProduct } from "@/types";
import { Disclosure } from "@headlessui/react";
import { Pagination, useTheme } from "flowbite-react";
import { FormEvent, useEffect, useRef, useState } from "react";

// const Button = () => {
//   const { systemTheme, theme, setTheme } = useTheme();
//   const currentTheme = theme === "system" ? systemTheme : theme;

//   return (
//     <button
//       onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
//       className="bg-gray-800 dark:bg-gray-50 hover:bg-gray-600 dark:hover:bg-gray-300 transition-all duration-100 text-white dark:text-gray-800 px-8 py-2 text-2xl md:text-4xl rounded-lg absolute bottom-32"
//     >
//       Toggle Mode
//     </button>
//   );
// };

const AllProductsTable = () => {
  const products = useAppSelector((state) => state.product.products);
  const baseProducts = useAppSelector((state) => state.product.baseProducts);

  const postsPerPage = 50;
  const [totalPages, setTotalPages] = useState(
    Math.ceil(product.length / postsPerPage)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [currentProducts, setCurrentProducts] = useState(products);
  const [displayedProducts, setDisplayedProducts] = useState(
    currentProducts.slice(0, postsPerPage)
  );

  const [baseProductId, setBaseProductId] = useState("-1");
  const [serialNumber, setSerialNumber] = useState("");
  const [gtinNumber, setGtinNumber] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [parcelId, setParcelId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("-1");
  const [state, setState] = useState("-1");

  const panelRef = useRef(null);

  const handleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentProducts(
      products
        .filter((product) => {
          return baseProductId != "-1"
            ? product.baseProductId == parseInt(baseProductId)
            : true;
        })
        .filter((product) => {
          return serialNumber != ""
            ? product.serialNumber == serialNumber
            : true;
        })
        .filter((product) => {
          return gtinNumber != "" ? product.gtinNumber == gtinNumber : true;
        })
        .filter((product) => {
          return lotNumber != ""
            ? product.lotNumber == parseInt(lotNumber)
            : true;
        })
        .filter((product) => {
          return parcelId != "" ? product.parcelId == parcelId : true;
        })
        .filter((product) => {
          return orderId != "" ? product.orderId == parseInt(orderId) : true;
        })
        .filter((product) => {
          return status != "-1" ? product.status == status : true;
        })
        .filter((product) => {
          return state != "-1" ? product.state == state : true;
        })
    );
  };

  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(Math.ceil(currentProducts.length / postsPerPage));
    setDisplayedProducts(currentProducts.slice(0, postsPerPage));
  }, [currentProducts]);

  // useEffect(
  //   () => setTotalPages(Math.ceil(currentProducts.length / postsPerPage)),
  //   [currentProducts]
  // );

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
              ref={panelRef}
              className="w-fit lg:w-full border-b-2 border-t dark:border-gray-700 dark:bg-gray-800"
            >
              <form onSubmit={(e) => handleFilterSubmit(e)}>
                <div className="grid grid-rows-8 py-6 lg:grid-cols-4 grid-rows-2 px-6">
                  <div className="min-w-[150px] col-span-1 mb-6 px-4 lg:py-3">
                    <label
                      htmlFor="baseProductId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      İlaç İsmi
                    </label>
                    <select
                      id="baseProductId"
                      name="baseProductId"
                      value={baseProductId}
                      onChange={(e) => setBaseProductId(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="-1"> - - - - - - - - - - - - - -</option>
                      {baseProducts.map((baseProduct) => (
                        <option
                          key={baseProduct.name + baseProduct.id}
                          value={baseProduct.id}
                        >
                          {baseProduct.manufacturer} - {baseProduct.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-[150px] mb-6 px-4 lg:py-3">
                    <label
                      htmlFor="serialNumber"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Seri Numarası
                    </label>
                    <input
                      type="text"
                      id="serialNumber"
                      name="serialNumber"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="min-w-[150px] mb-6 px-4 lg:py-3">
                    <label
                      htmlFor="gtinNumber"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      GTIN Numarası
                    </label>
                    <input
                      type="text"
                      id="gtinNumber"
                      name="gtinNumber"
                      value={gtinNumber}
                      onChange={(e) => setGtinNumber(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="min-w-[150px] mb-6 px-4 lg:py-3">
                    <label
                      htmlFor="lotNumber"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Lot Numarası
                    </label>
                    <input
                      type="text"
                      id="lotNumber"
                      name="lotNumber"
                      value={lotNumber}
                      onChange={(e) => setLotNumber(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="min-w-[150px] mb-6 px-4 lg:py-3">
                    <label
                      htmlFor="parcelId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Parsel Numarası
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

                  <div className="min-w-[150px] mb-6 px-4 lg:py-3">
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

                  <div className="min-w-[150px] col-span-1 mb-6 px-4 lg:py-3">
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
                      <option value="ON_RACK">Rafta</option>
                      <option value="ON_FLOOR">Yer</option>
                      <option value="ON_SECONDERY">Sekonder</option>
                      <option value="ON_PREPARATION">Hazırlama</option>
                      <option value="ON_TRANSFER">Transfer</option>
                      <option value="DELIVERED">İletildi</option>
                    </select>
                  </div>

                  <div className="min-w-[150px] col-span-1 mb-6 px-4 lg:py-3">
                    <label
                      htmlFor="state"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Durum
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={state}
                      onChange={(e) => setState(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="-1"> - - - - - - - - - - - - - -</option>
                      <option value="DAMAGED">Hasarlı</option>
                      <option value="UNDAMAGED">Hasarsız</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-8 px-4 pb-6 gap-3 justify-items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentProducts(products);
                      setStatus("-1");
                      setState("-1");
                      setBaseProductId("-1");
                      setSerialNumber("");
                      setGtinNumber("");
                      setLotNumber("");
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
                  <div className="col-span-1 px-4 py-3 ">Ürün İsmi</div>
                  <div className="col-span-1 px-4 py-3">Seri No</div>
                  <div className="col-span-1 px-4 py-3">GTIN No</div>
                  <div className="col-span-1 px-4 py-3">Lot No</div>
                  <div className="col-span-1  px-4 py-3">
                    <div className="flex flex-row justify-between items-center">
                      Üretim Tarihi
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
                  <div className="col-span-1 px-4 py-3">
                    <div className="flex items-center">
                      Son Kullanma Tarihi
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
                  <div className="col-span-1  px-4 py-3">Durum</div>
                  <div className="col-span-1  px-4 py-3">Aşama</div>
                  <div className="col-span-1  px-4 py-3">Parsel No</div>
                  <div className="col-span-1  px-4 py-3">Sipariş No</div>
                </div>

                {displayedProducts.map((product, productIndex) => (
                  <div
                    key={`product-${productIndex}`}
                    className="grid grid-flow-col auto-cols-[minmax(155px,1000px)] w-full text-center gap-6 border-b dark:border-gray-700"
                  >
                    <div className="col-span-1 px-4 py-3 self-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="grid grid-cols-5">
                        <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                          {
                            baseProducts.filter(
                              (p: BaseProduct) => p.id == product.baseProductId
                            )[0].name
                          }
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      {product.serialNumber}
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      {product.gtinNumber}
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      {product.lotNumber}
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      {product.productionDate || "null"}
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      {product.expirationDate || "null"}
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                        {product.state}
                      </span>
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                        {product.status}
                      </span>
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      <p className="text-gray-500 dark:text-gray-400">
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            //console.log(product.parcelId);
                            setCurrentProducts(
                              products.filter((p) => {
                                // product.parcelId == p.parcelId
                                //   ? console.log(p.parcelId)
                                //   : "";
                                return product.parcelId == p.parcelId;
                              })
                            );
                            // console.log(currentProducts);
                            // console.log(displayedProducts);
                          }}
                          className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          {product.parcelId}
                        </a>
                      </p>
                    </div>

                    <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                      <p className="text-gray-500 dark:text-gray-400">
                        <a
                          href="#"
                          className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          {product.orderId}
                        </a>
                      </p>
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
                  setDisplayedProducts(
                    currentProducts.slice(
                      (n - 1) * postsPerPage,
                      n * postsPerPage
                    )
                  );
                  setCurrentPage(n);
                }}
                showIcons
                totalPages={totalPages}
                //layout="navigation"
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

export default AllProductsTable;
