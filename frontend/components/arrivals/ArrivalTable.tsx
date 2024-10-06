import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  apiUpdateInHangarArrivalPalette,
  fetchInHangarArrivals,
  resetInHangarArrivalPalette,
  updateInHangarArrivalPaletteEditMode,
  updateInHangarArrivalPaletteHangar,
  updateInHangarArrivalPaletteRack,
} from "@/redux/slices/arrival";

import { fetchHangars, fetchRacks } from "@/redux/slices/storage";
import { Arrival, Hangar, Palette, Rack } from "@/types";
import { Disclosure } from "@headlessui/react";
import { ChangeEvent, useEffect, useState } from "react";

interface ArrivalTableProps {
  arrivals: Arrival[];
  hangars: { [key: string]: Hangar };
  racks: { [key: string]: Rack };
}
const ArrivalTable = (props: ArrivalTableProps) => {
  const dispatch = useAppDispatch();

  const handleArrivalHangarChange = (
    e: ChangeEvent<HTMLSelectElement>,
    arrivalIndex: number,
    paletteIndex: number
  ): void => {
    dispatch(
      updateInHangarArrivalPaletteHangar({
        arrivalIndex,
        paletteIndex,
        hangar: props.hangars[e.currentTarget.value],
      })
    );
  };

  const handleArrivalRackChange = (
    e: ChangeEvent<HTMLSelectElement>,
    arrivalIndex: number,
    paletteIndex: number
  ): void => {
    dispatch(
      updateInHangarArrivalPaletteRack({
        arrivalIndex,
        paletteIndex,
        rack: props.racks[e.currentTarget.value],
      })
    );
  };

  const handleArrivalPaletteUpdate = (
    arrivalIndex: number,
    paletteIndex: number,
    palette: Palette
  ): void => {
    if (palette.rack == null) {
      alert("Lutfen once raf atamasi yapiniz");
    } else {
      dispatch(
        apiUpdateInHangarArrivalPalette({
          arrivalIndex,
          paletteIndex,
          update: {
            paletteId: palette.id,
            hangarId: palette.hangar.id,
            rackId: palette.rack.id,
          },
        })
      ).then(() => {
        dispatch(fetchRacks());
        dispatch(fetchHangars());
      });
    }
  };

  const handleArrivalPaletteReset = (
    paletteId: string,
    arrivalIndex: number,
    paletteIndex: number
  ): void => {
    dispatch(
      resetInHangarArrivalPalette({ paletteId, arrivalIndex, paletteIndex })
    );
  };

  const handleArrivalPaletteEditMode = (
    arrivalIndex: number,
    paletteIndex: number,
    editMode: boolean
  ) => {
    dispatch(
      updateInHangarArrivalPaletteEditMode({
        arrivalIndex,
        paletteIndex,
        editMode,
      })
    );
  };

  const handleArrivalConfirm = (): void => {
    console.log("Handle arrival confirm.");
  };

  const isArrivalReady = (palettes: Palette[]): boolean => {
    const rackNullOrEditModePalettes = palettes.filter((palette) => {
      return palette.rack == null || palette.editMode == true;
    });

    if (rackNullOrEditModePalettes.length) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
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
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
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

          <div className="flex flex-col justify-center items-center overflow-auto w-full min-w-[700px] text-sm text-left text-gray-500 dark:text-gray-400">
            <div className="grid grid-cols-5 w-full gap-6 font-bold text-xs text-gray-700 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <div className="col-span-1 px-4 py-3">Kabul Id</div>
              <div className="col-span-1 px-4 py-3">Kabul Ismi</div>
              <div className="col-span-1 px-4 py-3">Paletler</div>
            </div>

            {props.arrivals?.map((arrival, arrivalIndex) => (
              <Disclosure key={arrival.invoiceNumber + arrivalIndex}>
                <div className="grid grid-cols-5 w-full gap-6 border-b dark:border-gray-700">
                  <div className="col-span-1 px-4 py-3 self-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {arrival.id}
                  </div>
                  <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    {arrival.companyName} - {arrival.invoiceNumber}
                  </div>
                  <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    Ilac Ismi
                  </div>

                  <div className="col-span-2 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    <Disclosure.Button
                      as="button"
                      role="button"
                      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                    >
                      Palet Sec
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

                <Disclosure.Panel
                  as="div"
                  className="w-full border-b-2 border-t dark:border-gray-700 dark:bg-gray-800"
                >
                  <Disclosure.Panel
                    as="div"
                    className="grid grid-cols-5 gap-6 py-1 w-full text-sm text-left text-red-800 tracking-wider bg-red-50  dark:bg-gray-800 dark:text-red-400"
                  >
                    <div className="col-span-1 px-4 py-3 text-gray-400 font-medium">
                      Palet Numarasi
                    </div>
                    <div className="col-span-1 px-4 py-3 text-gray-400 font-medium">
                      Ambar Ismi
                    </div>
                    <div className="col-span-1 px-4 py-3 text-gray-400 font-medium">
                      Raf Numarasi
                    </div>
                  </Disclosure.Panel>

                  {arrival.palettes.map((palette, paletteIndex) => (
                    <Disclosure.Panel
                      key={palette.id + paletteIndex}
                      as="div"
                      className="grid grid-cols-5 gap-6 py-4 w-full whitespace-nowrap text-sm "
                    >
                      <div className="overflow-hidden hover:overflow-auto  col-span-1 px-3 self-center">
                        {palette.id}
                      </div>
                      <div className="col-span-1 px-4 py-3 self-center">
                        {palette.editMode ? (
                          <select
                            id="hangarId"
                            name="hangarId"
                            value={
                              (palette.hangar?.id != null
                                ? palette.hangar?.id
                                : "-1") || "-1"
                            }
                            onChange={(e) =>
                              handleArrivalHangarChange(
                                e,
                                arrivalIndex,
                                paletteIndex
                              )
                            }
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="-1">
                              {" "}
                              - - - - - - - - - - - - - -
                            </option>
                            {Object.values(props.hangars).map((hangar) => (
                              <option
                                key={hangar.name + hangar.id}
                                value={hangar.id}
                              >
                                {hangar.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div>
                            {" "}
                            {palette.hangar != null
                              ? palette.hangar?.name
                              : "NA"}{" "}
                          </div>
                        )}
                      </div>
                      <div className="col-span-1 px-4 py-3 self-center">
                        {palette.editMode ? (
                          <select
                            id="rackId"
                            name="rackId"
                            value={
                              (palette.rack?.id != null
                                ? palette.rack?.id
                                : "-1") || "-1"
                            }
                            onChange={(e) =>
                              handleArrivalRackChange(
                                e,
                                arrivalIndex,
                                paletteIndex
                              )
                            }
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option
                              value={
                                palette.rack?.id != null
                                  ? palette.rack?.id
                                  : "-1"
                              }
                            >
                              {palette.rack?.id != null
                                ? palette.rack?.id
                                : "- - - - - - - - - - - - - -"}
                            </option>
                            {Object.values(props.racks)?.map((rack) =>
                              rack.palette == null &&
                              palette.rack?.id != rack.id ? (
                                <option key={rack.id} value={rack.id}>
                                  {rack.id}
                                </option>
                              ) : (
                                <></>
                              )
                            )}
                          </select>
                        ) : (
                          <div>
                            {palette.rack?.id != null
                              ? palette.rack?.id
                              : "Raf Atayiniz"}
                          </div>
                        )}
                      </div>

                      <div className="col-span-2 px-4 self-center whitespace-nowrap text-sm text-gray-500">
                        {palette.editMode ? (
                          <div className="grid grid-cols-4 gap-3">
                            <button
                              role="button"
                              onClick={() =>
                                handleArrivalPaletteReset(
                                  palette.id,
                                  arrivalIndex,
                                  paletteIndex
                                )
                              }
                              className="col-span-2  xl:col-span-1 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                            >
                              Sifirla
                            </button>
                            <button
                              role="button"
                              onClick={() =>
                                handleArrivalPaletteUpdate(
                                  arrivalIndex,
                                  paletteIndex,
                                  palette
                                )
                              }
                              className={
                                "col-span-2  xl:col-span-1 text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              }
                            >
                              Kaydet
                            </button>
                          </div>
                        ) : (
                          <button
                            role="button"
                            onClick={() =>
                              handleArrivalPaletteEditMode(
                                arrivalIndex,
                                paletteIndex,
                                true
                              )
                            }
                            className={
                              "text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            }
                          >
                            Duzenle
                          </button>
                        )}
                      </div>
                    </Disclosure.Panel>
                  ))}
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
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
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
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
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

export default ArrivalTable;
