import { Disclosure } from "@headlessui/react";
import Link from "next/link";

interface TableProps {
  elements: any;
}

const Table = (props: TableProps) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-w-screen divide-y divide-gray-200 m-8 mb-20 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="grid grid-cols-4 bg-gray-50 w-full gap-6 py-4">
          <div className="col-span-1 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Kabul Id
          </div>
          <div className="col-span-1 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Kabul Ismi
          </div>
          <div className="col-span-1 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Paletler
          </div>
          <div className="col-span-1 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></div>
        </div>
        {props.elements.map((element: any) => (
          <Disclosure>
            <div className="grid grid-cols-4 w-full gap-6 py-2">
              <div className="col-span-1 px-6 self-center whitespace-nowrap text-sm text-gray-500">
                {element.id}
              </div>
              <div className="col-span-1 px-6 self-center whitespace-nowrap text-sm text-gray-500">
                {element.companyName} - {element.invoiceNumber}
              </div>
              <div className="col-span-1 px-6 self-center whitespace-nowrap text-sm text-gray-500">
                <Disclosure.Button
                  as="button"
                  role="button"
                  className="bg-transparent hover:bg-indigo-700 text-sm text-indigo-500 hover:text-white font-bold py-2 px-4 border border-indigo-700 rounded"
                >
                  Paletler
                </Disclosure.Button>
              </div>
              <div className="col-span-1 px-6 self-center whitespace-nowrap text-sm text-gray-500">
                <button
                  role="button"
                  className="bg-transparent hover:bg-indigo-700 text-sm text-indigo-500 hover:text-white font-bold py-2 px-4 border border-indigo-700 rounded"
                >
                  Onayla
                </button>
              </div>
            </div>

            <Disclosure.Panel
              as="div"
              className="grid grid-cols-4 bg-red-200 w-full gap-6 py-4"
            >
              <div className="col-span-1 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Palet Numarasi
              </div>
              <div className="col-span-1 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ambar Ismi
              </div>
              <div className="col-span-1 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Raf Numarasi
              </div>
              <div className="col-span-1 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></div>
            </Disclosure.Panel>
            {element.palettes.map((palette: any) => (
              <Disclosure.Panel
                as="div"
                className="grid grid-cols-4 w-full bg-red-100 gap-6 py-2"
              >
                <div className="col-span-1 px-6 self-center whitespace-nowrap text-sm text-gray-500">
                  {palette.id}
                </div>
                <div className="col-span-1 px-6 self-center whitespace-nowrap text-sm text-gray-500">
                  {palette.hangar.name}
                </div>
                <div className="col-span-1 px-6 self-center whitespace-nowrap text-sm text-gray-500">
                  <select
                    id="rackId"
                    name="rackId"
                    // value={palette.hangarId}
                    // onChange={(e) => handlePaletteChange(index, e)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="-1"> - - - - - - - - - - - - - -</option>
                    {palette.hangar.racks.map((rack: any) => (
                      <option value={rack.id}>{rack.id}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1 px-6 self-center whitespace-nowrap text-sm text-gray-500">
                  <button
                    role="button"
                    className="bg-transparent hover:bg-indigo-700 text-sm text-indigo-500 hover:text-white font-bold py-2 px-4 border border-indigo-700 rounded"
                  >
                    Kaydet
                  </button>
                </div>
              </Disclosure.Panel>
            ))}
          </Disclosure>
        ))}
      </div>
    </>
  );
};

export default Table;
