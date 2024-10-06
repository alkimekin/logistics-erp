export interface BaseProduct {
  id: number;
  manufacturer: string;
  name: string;
}

export interface Product {
  serialNumber: string;
  baseProductId: number;
  barcodeNumber?: string;

  gtinNumber: string;
  lotNumber: number;
  productionDate?: string;
  expirationDate?: string;

  parcelId: string | null;
  orderId: number | null;
  liftWorkOrderId: number | null;

  state: string;
  status: string;
  restriction: string;
}

export interface Parcel {
  id: string;
  products?: Product[];

  paletteId: string;
  orderId: number;
  liftWorkOrderId: number;

  status: string;
  restriction: string;
}

export interface Palette {
  id: string;
  baseProductId: string;
  hangarId: string;
  rackId?: string;
  paletteId: string;
  productCode: string;
  lotNumber: string;
  expirationDate: string;
  productNumber: string;

  rack: Rack | null;
  hangar: Hangar;

  editMode?: boolean;
}

export interface Rack {
  id: number;
  hangarId?: string;
  palette: Palette | null;
}

export interface Hangar {
  id: number;
  name: string;
  racks: Rack[];
}

export interface Arrival {
  id: number;
  status: string;
  companyName: string;
  invoiceNumber: string;
  palettes: Palette[];

  watchfileLoading?: boolean;
  watchfileLoaded?: boolean;
  watchfileErrors?: any[];
  editMode?: boolean;
}

export interface DispatchProduct {
  id: number;
  baseProductId: number;
  count: number;
  lotNumber: string;
  dispatchNoteId: number;
}

export interface DispatchProductWithSum {
  baseProduct: BaseProduct;
  lotNumber: string;
  total: number;
}

export interface DispatchNote {
  id: number;
  companyName: string;
  invoiceNumber: string;
  ettnCode: string;
  orderId: number | null;
  products: DispatchProduct[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  role: string;
}

// export interface LiftWorkOrder {
//   id: number;
//   status: string;
// }

export interface Order {
  id: number;
  companyName?: string;
  invoiceNumber: string;
  dispatchNotes?: DispatchNote[];

  liftWorkOrder?: any;
  liftWorkOrderId?: number;

  products?: Product[];
  parcels?: Parcel[];
  palettes?: Palette[];

  status: string;
}

export interface LiftWorkOrder {
  id: number;
  productLocations: {
    rackId: number;
    hangarName: string;
    palettes: number;
    parcels: number;
    products: number;
    openParcels: string[];
  }[];
}
