import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addWatchfileToArrival,
  udpateWatchfileLoadedArrivalsLoadingState,
  updateWatchfileArrivalWatchfileLoaded,
} from "@/redux/slices/arrival";

import { Arrival, Hangar, Palette, Rack } from "@/types";
import { Disclosure } from "@headlessui/react";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface WatchfileTableProps {
  arrivals: Arrival[];
}

const WatchfileTable = (props: WatchfileTableProps) => {
  const dispatch = useAppDispatch();
  const isCalled = useRef(false);

  const [xmlData, setXmlData] = useState<string[]>(
    props.arrivals.map((arrival) => {
      return "";
    })
  );

  const [watchFileInputValues, setWatchFileInputValues] = useState<string[]>(
    props.arrivals.map((arrival) => {
      return "";
    })
  );

  useEffect(() => {
    if (props.arrivals.length && !isCalled.current) {
      setXmlData(
        props.arrivals.map((arrival) => {
          return "";
        })
      );

      setWatchFileInputValues(
        props.arrivals.map((arrival) => {
          return "";
        })
      );

      isCalled.current = true;
    }
  }, [props.arrivals]);

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     dispatch(udpateWatchfileLoadedArrivalsLoadingState());
  //   }, 2000);

  //   return () => clearInterval(id);
  // }, []);

  const handleArrivalWatchfileUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
    arrivalIndex: number
  ) => {
    let newWatchFileInputValues = [...watchFileInputValues];
    newWatchFileInputValues[arrivalIndex] = event.currentTarget.value;
    setWatchFileInputValues(newWatchFileInputValues);

    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = function () {
      let newXmlData = [...xmlData];
      newXmlData[arrivalIndex] = reader.result as string;
      setXmlData(newXmlData);
    };

    reader.readAsText(file);
  };

  const handleWatchFileConfirm = (
    arrivalId: number,
    arrivalIndex: number
  ): void => {
    dispatch(
      addWatchfileToArrival({
        arrivalIndex,
        arrivalId,
        xmlData: xmlData[arrivalIndex],
      })
    );
  };

  const handleWatchFileReloadConfirm = (arrivalIndex: number) => {
    dispatch(
      updateWatchfileArrivalWatchfileLoaded({
        arrivalIndex,
        watchfileLoaded: false,
      })
    );
  };

  const isWatchfileReady = (arrivalIndex: number): boolean => {
    return xmlData[arrivalIndex] != "";
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Ara
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
          </div>

          <div className="flex flex-col justify-center items-center  w-full min-w-[1000px] text-sm text-left text-gray-500 dark:text-gray-400">
            <div className="grid grid-cols-6 w-full gap-6 font-bold text-xs text-gray-700 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <div className="col-span-1 px-4 py-3">KABUL ID</div>
              <div className="col-span-1 px-4 py-3">KABUL İSMİ</div>
              <div className="col-span-1 px-4 py-3">İlAÇ İSMİ</div>
              <div className="col-span-2 px-4 py-3">İzleme Dosyası</div>
              <div className="col-span-1 px-4 py-3"></div>
            </div>
            {props.arrivals?.map((arrival, arrivalIndex) => (
              <Disclosure key={arrival.invoiceNumber + arrival.id}>
                <div className="grid grid-cols-6 w-full gap-6 border-b dark:border-gray-700">
                  <div className="col-span-1 px-4 py-3 self-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {arrival.id}
                  </div>
                  <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    {arrival.companyName} - {arrival.invoiceNumber}
                  </div>
                  <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    İlaç İsmi
                  </div>
                  <div className="col-span-2 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    {arrival.watchfileLoaded ? (
                      <div className="grid grid-cols-3 gap-8 w-full">
                        <div className="col-span-1 self-center">
                          Izleme dosyasi yukludur.
                        </div>
                        <div className="col-span-1 col-start-3 justify-self-end">
                          <Disclosure.Button
                            as="button"
                            role="button"
                            className={
                              "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" +
                              (arrival.watchfileErrors?.length == 0
                                ? " hidden"
                                : "")
                            }
                          >
                            Uyarilar
                            <svg
                              className="w-4 h-4 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              focusable="false"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </Disclosure.Button>
                        </div>
                      </div>
                    ) : (
                      <input
                        onChange={(e) =>
                          handleArrivalWatchfileUpdate(e, arrivalIndex)
                        }
                        value={watchFileInputValues[arrivalIndex]}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="file_input"
                        type="file"
                      />
                    )}
                  </div>
                  <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    {arrival.watchfileLoaded ? (
                      <button
                        role="button"
                        onClick={() =>
                          handleWatchFileReloadConfirm(arrivalIndex)
                        }
                        className={
                          "text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                        }
                      >
                        Tekrar Yukle
                      </button>
                    ) : (
                      <>
                        {arrival.watchfileLoading ? (
                          <button
                            disabled
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                          >
                            <svg
                              aria-hidden="true"
                              role="status"
                              className="inline w-4 h-4 mr-3 text-white animate-spin"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#E5E7EB"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentColor"
                              />
                            </svg>
                            Yukleniyor
                          </button>
                        ) : (
                          <button
                            role="button"
                            onClick={() =>
                              handleWatchFileConfirm(arrival.id, arrivalIndex)
                            }
                            className={
                              isWatchfileReady(arrivalIndex)
                                ? "text-white bg-blue-700 hover:bg-transparent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                : "text-white bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600  dark:focus:ring-blue-800 cursor-not-allowed opacity-50 "
                            }
                            disabled={!isWatchfileReady(arrivalIndex)}
                          >
                            Yukle
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* <Disclosure.Panel 
                as></> */}
                <Disclosure.Panel
                  as="div"
                  className="grid grid-cols-6  gap-6 py-4 w-full text-sm text-left text-red-800 tracking-wider bg-red-50 dark:bg-gray-800 dark:text-red-400"
                >
                  <div className="col-span-1 px-6 text-red-500 font-medium">
                    Hata Adi
                  </div>
                  <div className="col-span-2 px-6 text-red-500 font-medium">
                    Hata Aciklamasi
                  </div>
                </Disclosure.Panel>

                {arrival.watchfileErrors?.map(
                  (watchfileError, watchfileErrorIndex) => (
                    <Disclosure.Panel
                      key={watchfileError.type + watchfileErrorIndex}
                      as="div"
                      className="grid grid-cols-6 gap-6 py-4 w-full whitespace-nowrap text-sm"
                    >
                      <div className="col-span-1 px-6 self-center">
                        {watchfileError.type}
                      </div>
                      <div className="col-span-2 px-6 self-center">
                        {watchfileError.text}
                      </div>
                    </Disclosure.Panel>
                  )
                )}
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

export default WatchfileTable;
