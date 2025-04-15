export interface Restaurant {
  id: string;
  name: string;
  picture: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  shortLocation: string;
  tel: string;
  region: string;
  openTime: string;
  closeTime: string;
  rating?: number;
  queue?: string;
}

export interface Reservation {
  _id?: string;
  resDate: Date;
  user: {
    id?: string;
    name: string;
    tel: string;
  };
  restaurant: {
    id?: string;
    name: string;
    province: string;
    tel: string;
  };
  seatCount: number;
  createdAt: Date;
}

export interface Review {
  _id: string;
  username: string;
  reviewStar: number;
  reviewText: string;
}

export interface RestaurantJSON {
  count: number
  data: Restaurant[]
  totalPages: number
}

export interface ReservationJSON {
  success: boolean
  count: number
  data: Reservation[]
}

export interface ReviewJSON {
  count: number
  data: Restaurant[]
}


