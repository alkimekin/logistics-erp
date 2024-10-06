import { BaseProduct, Hangar, Palette, Rack } from "@/types";
import { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import Html5QrcodePlugin from "../Html5QrcodePlugin";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createNewArrival } from "@/redux/slices/arrival";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const NewArrival = () => {
  const [companyName, setCompanyName] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [palettes, setPalettes] = useState<
    Omit<Palette, "id" | "hangar" | "rack">[]
  >([
    {
      baseProductId: "-1",
      hangarId: "-1",
      rackId: "-1",
      paletteId: "",
      productCode: "",
      lotNumber: "",
      expirationDate: "",
      productNumber: "",
    },
  ]);

  const [show, setShow] = useState(false);

  const dispatch = useAppDispatch();
  const baseProducts = useAppSelector((state) => state.product.baseProducts);
  const hangars = useAppSelector((state) => state.storage.hangars);
  const racks = useAppSelector((state) => state.storage.racks);

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.currentTarget.value);
  };

  const handleInvoiceNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInvoiceNumber(e.currentTarget.value);
  };

  const handlePaletteChange = (
    i: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let newPalettes = [...palettes];
    newPalettes[i][
      e.currentTarget.name as keyof Omit<
        Palette,
        "id" | "hangar" | "rack" | "editMode"
      >
    ] = e.currentTarget.value;
    setPalettes(newPalettes);
  };

  const handlePaletteIdQrChange = (i: number, paletteId: string) => {
    let newPalettes = [...palettes];
    newPalettes[i].paletteId = paletteId;
    setPalettes(newPalettes);
    setShow(false);
  };

  const addPalette = () => {
    setPalettes([
      ...palettes,
      {
        baseProductId: palettes[palettes.length - 1].baseProductId,
        hangarId: palettes[palettes.length - 1].hangarId,
        rackId: "-1",
        paletteId: "",
        productCode: palettes[palettes.length - 1].productCode,
        lotNumber: palettes[palettes.length - 1].lotNumber,
        expirationDate: palettes[palettes.length - 1].expirationDate,
        productNumber: palettes[palettes.length - 1].productNumber,
      },
    ]);
  };

  const removePalette = (i: number) => {
    let newPalettes = [...palettes];
    newPalettes.splice(i, 1);
    setPalettes(newPalettes);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const arrival = { companyName, invoiceNumber, palettes };
    console.log(arrival);
    dispatch(createNewArrival(arrival));
    setCompanyName("");
    setInvoiceNumber("");
    setPalettes([
      {
        baseProductId: "-1",
        hangarId: "-1",
        rackId: "-1",
        paletteId: "",
        productCode: "",
        lotNumber: "",
        expirationDate: "",
        productNumber: "",
      },
    ]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="text"
          name="floating_email"
          id="floating_email"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          onChange={(e) => handleCompanyNameChange(e)}
          required
        />
        <label
          htmlFor="floating_email"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Firma İsmi
        </label>
      </div>
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="text"
          name="floating_password"
          id="floating_password"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          onChange={(e) => handleInvoiceNumberChange(e)}
          required
        />
        <label
          htmlFor="floating_password"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          İrsaliye Numarasi
        </label>
      </div>

      <div>
        <div className="flex pt-4 py-5 block text-lg font-medium text-gray-700 dark:text-white">
          Paletler
        </div>

        {palettes.map((palette, index) => (
          <div
            key={`palette-${index}`}
            className="grid py-6 md:grid-cols-4 md:gap-6"
          >
            <div className="col-span-1 mb-6">
              <label
                htmlFor="baseProductId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                İlaç İsmi
              </label>
              <select
                id="baseProductId"
                name="baseProductId"
                value={palette.baseProductId}
                onChange={(e) => handlePaletteChange(index, e)}
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

            <div className="col-span-1 mb-6">
              <label
                htmlFor="baseProductId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Ambar İsmi
              </label>
              <select
                id="hangarId"
                name="hangarId"
                value={palette.hangarId}
                onChange={(e) => handlePaletteChange(index, e)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="-1"> - - - - - - - - - - - - - -</option>
                {Object.values(hangars).map((hangar) => (
                  <option key={hangar.name + hangar.id} value={hangar.id}>
                    {hangar.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1 mb-6">
              <label
                htmlFor="rackId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Raf Numarası
              </label>
              <select
                id="rackId"
                name="rackId"
                value={palette.rackId}
                onChange={(e) => handlePaletteChange(index, e)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="-1"> - - - - - - - - - - - - - -</option>
                {Object.values(racks).map((rack) =>
                  rack.palette == null ? (
                    <option key={rack.id} value={rack.id}>
                      {rack.id}
                    </option>
                  ) : (
                    <></>
                  )
                )}
              </select>
            </div>

            <div className="mb-6">
              <div className="flex flex-row justify-between">
                <label
                  htmlFor="paletteId"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Palet Numarası
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShow(true);
                  }}
                  className="flex text-sm font-medium text-blue-500 hover:text-blue-700"
                >
                  Barkod Okut +
                </button>
                <Modal
                  dismissible={true}
                  show={show}
                  onClose={() => setShow(false)}
                >
                  <Modal.Body>
                    <div className="relative w-full max-w-2xl max-h-full">
                      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                          <Html5QrcodePlugin
                            show={show}
                            fps={10}
                            qrbox={250}
                            disableFlip={false}
                            qrCodeSuccessCallback={(data: any) =>
                              handlePaletteIdQrChange(index, data)
                            }
                          />

                          <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setShow(false);
                            }}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
              <input
                type="text"
                id="paletteId"
                name="paletteId"
                value={palette.paletteId || ""}
                onChange={(e) => handlePaletteChange(index, e)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="productCode"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Malzeme Kodu
              </label>
              <input
                type="text"
                id="productCode"
                name="productCode"
                value={palette.productCode || ""}
                onChange={(e) => handlePaletteChange(index, e)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
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
                value={palette.lotNumber}
                onChange={(e) => handlePaletteChange(index, e)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="expirationDate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                S.K.T
              </label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                value={palette.expirationDate || ""}
                onChange={(e) => handlePaletteChange(index, e)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="productNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Ürün Adedi
              </label>
              <input
                type="text"
                id="productNumber"
                name="productNumber"
                value={palette.productNumber || ""}
                onChange={(e) => handlePaletteChange(index, e)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {index ? (
              <button
                type="button"
                onClick={() => removePalette(index)}
                className="inline-flex justify-center md:col-end-5 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sil
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 grid-rows-2">
        <button
          type="button"
          onClick={() => addPalette()}
          className="col-start-1 row-start-1 flex w-fit pt-4 text-base font-medium text-blue-500 hover:text-blue-700"
        >
          Yeni Palet Ekle +
        </button>

        <button
          type="submit"
          className="col-start-5 row-start-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Kaydet
        </button>
      </div>
    </form>
  );
};

export default NewArrival;
