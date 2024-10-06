import { LiftWorkOrder } from "@/types";
import { Disclosure } from "@headlessui/react";
import { Button, Modal, Tabs } from "flowbite-react";
import { ChangeEvent, use, useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { useAppDispatch } from "@/redux/hooks";
import { endLiftOrder } from "@/redux/slices/order";

interface WorkOrderTableProps {
  liftWorkOrders: LiftWorkOrder[];
}

interface ModalFormProps {
  orderId: number;
  sumStorage: {
    numPalettes: number;
    numParcels: number;
    numProducts: number;
  };
  closeModal: any;
}

interface ModalFormCameraProps {
  successCallback: any;
  closeCameraScreen: any;
}

const ModalFormCamera = (props: ModalFormCameraProps) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [videoInputDevices, setVideoInputDevices] = useState([]);
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader>(
    new BrowserMultiFormatReader()
  );
  console.log("ZXing code reader initialized");

  useEffect(() => {
    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices && videoInputDevices.length) {
          // TODO: For now just selecting the first device, this needs to change
          setSelectedDeviceId(videoInputDevices[0].deviceId);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    codeReader
      .decodeOnceFromVideoDevice(selectedDeviceId, "video")
      .then((result) => {
        props.successCallback(result.getText());
        codeReader.reset();
        props.closeCameraScreen();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex flex-col">
      <video id="video" width="100%" height="480px" />
      <Button
        color="red"
        className="flex self-end"
        onClick={() => {
          codeReader.reset();
          props.closeCameraScreen();
          setCodeReader(new BrowserMultiFormatReader());
        }}
      >
        X
      </Button>
    </div>
  );
};

const ModalForm = (props: ModalFormProps) => {
  const [palettes, setPalettes] = useState<string[]>([]);
  const [paletteId, setPaletteId] = useState<string>("");

  // Option 0: Renders two buttons for selecting option 1 and 2 (DEFAULT)
  // Option 1: Renders manual palette input field
  // Option 2: Renders camera based palette input system
  const [paletteAddField, setPaletteAddField] = useState<number>(0);

  const [parcels, setParcels] = useState<string[]>([]);
  const [parcelId, setParcelId] = useState<string>("");

  // Option 0: Renders two buttons for selecting option 1 and 2 (DEFAULT)
  // Option 1: Renders manual parcel input field
  // Option 2: Renders camera based parcel input system
  const [parcelAddField, setParcelAddField] = useState<number>(0);

  const [products, setProducts] = useState<string[]>([]);
  const [productId, setProductId] = useState<string>("");

  // Option 0: Renders two buttons for selecting option 1 and 2 (DEFAULT)
  // Option 1: Renders manual product input field
  // Option 2: Renders camera based product input system
  const [productAddField, setProductAddField] = useState<number>(0);

  const dispatch = useAppDispatch();

  const openPaletteInputWithCamera = () => {
    setPaletteAddField(2);
  };

  const closePaletteInputWithCamera = () => {
    setPaletteAddField(0);
  };

  const removePalette = (i: number) => {
    let newPalettes = [...palettes];
    newPalettes.splice(i, 1);
    setPalettes(newPalettes);
  };

  const removeParcel = (i: number) => {
    let newParcels = [...parcels];
    newParcels.splice(i, 1);
    setParcels(newParcels);
  };

  const removeProduct = (i: number) => {
    let newProducts = [...products];
    newProducts.splice(i, 1);
    setProducts(newProducts);
  };

  const handlePaletteIdChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setPaletteId(e.currentTarget.value);
  };

  return (
    <div className="flex flex-col w-full">
      <form>
        <Tabs.Group
          aria-label="EndWorkOrder"
          style="underline"
          className="self-center text-medium text-gray-400"
        >
          <Tabs.Item title="Paletler">
            <hr className="col-span-2 h-px mb-6 bg-gray-200 border-0 dark:bg-gray-600"></hr>

            <div className="grid grid-cols-2">
              <div className="grid grid-cols-3 col-span-2 justify-items-center">
                {palettes.map((palette, paletteIndex) => (
                  <div
                    key={`palette-${paletteIndex}`}
                    className="col-span-1 flex flex-row space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-green-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <p>{palette}</p>

                    <button
                      type="button"
                      onClick={() => removePalette(paletteIndex)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-red-500 hover:text-red-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <hr className="col-span-2 h-px my-6 bg-gray-200 border-0 dark:bg-gray-600"></hr>

              {paletteAddField == 0 ? (
                <div className="col-span-2 flex flex-row items-center justify-between mx-24">
                  <Button
                    outline={true}
                    className="min-w-[200px]"
                    onClick={() => setPaletteAddField(1)}
                  >
                    Manuel Ekle
                  </Button>
                  <Button
                    outline={true}
                    className="min-w-[200px]"
                    onClick={() => openPaletteInputWithCamera()}
                  >
                    Barkod Okutarak Ekle
                  </Button>
                </div>
              ) : paletteAddField == 1 ? (
                <div className="col-span-2 flex flex-row items-center justify-between">
                  <div className="flex flex-row gap-6">
                    <input
                      type="text"
                      id="forkliftPalette"
                      name="forkliftPalette"
                      value={paletteId}
                      onChange={(e) => setPaletteId(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <Button
                      disabled={paletteId == ""}
                      onClick={() => setPalettes([...palettes, paletteId])}
                    >
                      Ekle
                    </Button>
                  </div>
                  <Button color="red" onClick={() => setPaletteAddField(0)}>
                    X
                  </Button>
                </div>
              ) : (
                <div className="col-span-2 flex flex-col">
                  <ModalFormCamera
                    successCallback={(result: any) => {
                      console.log("Result: ", result);
                      setPalettes([...palettes, result]);
                    }}
                    closeCameraScreen={closePaletteInputWithCamera}
                  />
                </div>
              )}
            </div>
          </Tabs.Item>
          <Tabs.Item title="Koliler">
            <hr className="col-span-2 h-px mb-6 bg-gray-200 border-0 dark:bg-gray-600"></hr>

            <div className="grid grid-cols-2">
              <div className="grid grid-cols-3 col-span-2 justify-items-center">
                {parcels.map((parcel, parcelIndex) => (
                  <div
                    key={`parcel-${parcelIndex}`}
                    className="col-span-1 flex flex-row space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-green-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <p>{parcel}</p>

                    <button
                      type="button"
                      onClick={() => removeParcel(parcelIndex)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-red-500 hover:text-red-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <hr className="col-span-2 h-px my-6 bg-gray-200 border-0 dark:bg-gray-600"></hr>

              {parcelAddField == 0 ? (
                <div className="col-span-2 flex flex-row items-center justify-between mx-24">
                  <Button
                    outline={true}
                    className="min-w-[200px]"
                    onClick={() => setParcelAddField(1)}
                  >
                    Manuel Ekle
                  </Button>
                  <Button
                    outline={true}
                    className="min-w-[200px]"
                    onClick={() => setParcelAddField(2)}
                  >
                    Barkod Okutarak Ekle
                  </Button>
                </div>
              ) : parcelAddField == 1 ? (
                <div className="col-span-2 flex flex-row items-center justify-between">
                  <div className="flex flex-row gap-6">
                    <input
                      type="text"
                      id="forkliftParcel"
                      name="forkliftParcel"
                      value={parcelId}
                      onChange={(e) => setParcelId(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <Button
                      disabled={parcelId == ""}
                      onClick={() => setParcels([...parcels, parcelId])}
                    >
                      Ekle
                    </Button>
                  </div>
                  <Button color="red" onClick={() => setParcelAddField(0)}>
                    X
                  </Button>
                </div>
              ) : (
                <div className="col-span-2 flex flex-col">
                  <ModalFormCamera
                    successCallback={(result: any) => {
                      console.log("Result: ", result);
                      setParcels([...parcels, result]);
                    }}
                    closeCameraScreen={() => setParcelAddField(0)}
                  />
                </div>
              )}
            </div>
          </Tabs.Item>
          <Tabs.Item title="Urunler">
            <hr className="col-span-2 h-px mb-6 bg-gray-200 border-0 dark:bg-gray-600"></hr>
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-3 col-span-2 justify-items-center">
                {products.map((product, productIndex) => (
                  <div
                    key={`product-${productIndex}`}
                    className="col-span-1 flex flex-row space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-green-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <p>{product}</p>

                    <button
                      type="button"
                      onClick={() => removeProduct(productIndex)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-red-500 hover:text-red-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <hr className="col-span-2 h-px my-6 bg-gray-200 border-0 dark:bg-gray-600"></hr>

              {productAddField == 0 ? (
                <div className="col-span-2 flex flex-row items-center justify-between mx-24">
                  <Button
                    outline={true}
                    className="min-w-[200px]"
                    onClick={() => setProductAddField(1)}
                  >
                    Manuel Ekle
                  </Button>
                  <Button
                    outline={true}
                    className="min-w-[200px]"
                    onClick={() => setProductAddField(2)}
                  >
                    Barkod Okutarak Ekle
                  </Button>
                </div>
              ) : productAddField == 1 ? (
                <div className="col-span-2 flex flex-row items-center justify-between">
                  <div className="flex flex-row gap-6">
                    <input
                      type="text"
                      id="forkliftProduct"
                      name="forkliftProduct"
                      value={productId}
                      onChange={(e) => setProductId(e.currentTarget.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <Button
                      disabled={productId == ""}
                      onClick={() => setProducts([...products, productId])}
                    >
                      Ekle
                    </Button>
                  </div>
                  <Button color="red" onClick={() => setProductAddField(0)}>
                    X
                  </Button>
                </div>
              ) : (
                <div className="col-span-2 flex flex-col">
                  <ModalFormCamera
                    successCallback={(result: any) => {
                      console.log("Result: ", result);
                      setProducts([...products, result]);
                    }}
                    closeCameraScreen={() => setProductAddField(0)}
                  />
                </div>
              )}
            </div>
          </Tabs.Item>
        </Tabs.Group>
      </form>
      <hr className="h-px mt-2 mb-3 bg-gray-200 border-0 dark:bg-gray-600"></hr>
      <div className="flex flex-row w-full mb-3 px-6 space-x-2">
        <Button
          disabled={
            props.sumStorage.numPalettes != palettes.length ||
            props.sumStorage.numParcels != parcels.length ||
            props.sumStorage.numProducts != products.length
          }
          onClick={() =>
            dispatch(
              endLiftOrder({
                orderId: props.orderId,
                paletteIds: palettes,
                parcelIds: parcels,
                productIds: products,
              })
            )
          }
        >
          Sonlandir
        </Button>
        <Button color="red" onClick={props.closeModal}>
          Iptal Et
        </Button>
      </div>
    </div>
  );
};

const WorkOrderTable = (props: WorkOrderTableProps) => {
  const [showModal, setShowModal] = useState<boolean>(true);

  const sumStorageInLiftOrder = (order: LiftWorkOrder) => {
    let numPalettes = 0;
    let numParcels = 0;
    let numProducts = 0;
    for (const productLocation of order.productLocations) {
      numPalettes += productLocation.palettes;
      numParcels +=
        productLocation.parcels + productLocation.openParcels.length;
      numProducts += productLocation.products;
    }

    return { numPalettes, numParcels, numProducts };
  };

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

            <div className="col-span-3">
              <div className="flex justify-end"></div>

              {/* <Modal dismissible={true} show={true}>
                <Modal.Header>Is Emrini Sonlandir</Modal.Header>
                <Modal.Body>
                  <div className="grid grid-cols-2">
                    <div className="col-span-2"> Paletler: </div>
                    {palettes.map((palette) => (
                      <div className="col-span-1"> {palette} </div>
                    ))}
                    <form className="col-span-2 flex flex-row gap-6">
                      <input
                        type="text"
                        id="forkliftPalette"
                        name="forkliftPalette"
                        value={paletteId}
                        onChange={(e) => setPaletteId(e.currentTarget.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <Button
                        className=""
                        onClick={() => setPalettes([...palettes, paletteId])}
                      >
                        Palet Ekle
                      </Button>
                    </form>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button>Sonlandir</Button>
                  <Button color="red">Iptal Et</Button>
                </Modal.Footer>
              </Modal> */}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center overflow-auto w-full min-w-[700px] text-sm text-left text-gray-500 dark:text-gray-400">
            <div className="grid grid-cols-5 self-center w-full gap-6 font-bold text-xs text-gray-700 uppercase text-center tracking-wider bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <div className="col-span-1 px-4 py-3">
                <div className="grid grid-cols-5">
                  <div className="col-span-2 col-start-3 ">Siparis Id</div>
                </div>
              </div>

              <div className="flex w-full col-span-1 px-4 py-3 items-center justify-center">
                Siparis Tarihi
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 ml-1"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 320 512"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                </svg>
              </div>

              <div className="col-span-1 px-4 py-3">Asamasi</div>
            </div>

            {props.liftWorkOrders.map((order, orderIndex) => (
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
                    tarih
                  </div>

                  <div className="col-span-1 px-4 py-3 self-center whitespace-nowrap text-sm text-gray-500">
                    asama
                  </div>

                  <div className="col-span-2 col-start-4 px-4 py-3 self-center justify-self-end">
                    <Button color="indigo" onClick={() => setShowModal(true)}>
                      Is emrini tamamla
                    </Button>
                  </div>
                </div>

                <Disclosure.Panel
                  as="div"
                  className="w-full border-b-2 border-t dark:border-gray-700 dark:bg-gray-800"
                >
                  <Disclosure.Panel
                    as="div"
                    className="grid grid-cols-7 gap-5 py-4 w-full text-sm text-center text-red-800 tracking-wider bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  >
                    <div className="col-span-1 px-6 text-gray-400 text-center font-medium ">
                      Raf
                    </div>
                    <div className="col-span-1 px-6 text-gray-400  font-medium ">
                      Hangar
                    </div>
                    <div className="col-span-1 px-6 text-gray-400  font-medium ">
                      Palet
                    </div>
                    <div className="col-span-1 px-6 text-gray-400  font-medium ">
                      Koli
                    </div>
                    <div className="col-span-1 px-6 text-gray-400  font-medium ">
                      Urun
                    </div>
                    <div className="col-span-2 px-6 text-gray-400 text-center font-medium ">
                      Acik Koli
                    </div>
                  </Disclosure.Panel>

                  {order.productLocations.map(
                    (productLocation, productLocationIndex) => (
                      <Disclosure.Panel
                        key={`productLocation-${productLocationIndex}`}
                        as="div"
                        className="grid grid-cols-7 gap-5"
                      >
                        <div className="col-span-1 px-6 py-3 self-center text-center">
                          {productLocation.rackId}
                        </div>
                        <div className="col-span-1 px-6 py-3 self-center text-center">
                          {productLocation.hangarName}
                        </div>
                        <div className="col-span-1 px-6 py-3 self-center text-center">
                          {productLocation.palettes}
                        </div>
                        <div className="col-span-1 px-6 py-3 self-center text-center">
                          {productLocation.parcels}
                        </div>
                        <div className="col-span-1 px-6 py-3 self-center text-center">
                          {productLocation.products}
                        </div>
                        <div className="col-span-2 px-6 py-3 self-center text-center">
                          {productLocation.openParcels}
                        </div>
                      </Disclosure.Panel>
                    )
                  )}
                </Disclosure.Panel>

                <Modal
                  size="4xl"
                  dismissible={true}
                  show={showModal}
                  onClose={() => setShowModal(false)}
                >
                  <Modal.Header>Tasima Is Emri: {order.id}</Modal.Header>
                  {/* <Modal.Body> */}
                  <ModalForm
                    orderId={order.id}
                    sumStorage={sumStorageInLiftOrder(order)}
                    closeModal={() => setShowModal(false)}
                  />
                  {/*   */}
                  {/* <Modal.Footer>
                    <Button>Sonlandir</Button>
                    <Button color="red" onClick={() => setShowModal(false)}>
                      Iptal Et
                    </Button>
                  </Modal.Footer> */}
                </Modal>
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

export default WorkOrderTable;
