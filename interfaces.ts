export interface Restaurant {
  _id?: string;
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
  seatPerReservationLimit: number
  reservationLimit: number

}

export interface Reservation {
  _id?: string;
  resDate: Date;
  user: {
    _id?: string;
    name: string;
    tel: string;
  };
  restaurant: {
    _id?: string;
    name: string;
    province: string;
    tel: string;
  };
  seatCount: number;
  createdAt: Date;
}
export interface Review{
  _id?: string;
  user:  {
    _id?: string;
    name: string;
  };
  restaurant:  {
    _id?: string;
    name: string;
  };
  reviewStar: number;
  reviewText: string;
  createdAt:Date;
}
export interface MeanReview{
  success:string,
  name:string,
  totalRating:number,
  count:number
}

export interface SingleRestaurantJSON{
    success: boolean,
    count: number,
    pagination: Object,
    data: Restaurant
}

export interface Profile{
  _id?: string,
  name: string,
  tel: string,
  email: string,
  role: string, 
  createdAt:string
  
}

export interface Menu {
  _id?:string;
  name: string;
  restaurant: string;
  picture: string;
  price: number;
  type: string;
  description: string;
  tag: string[];
}

export interface AuthCookie {
  success: boolean;
  token?: string;
  role?: string;
  error?: string;
}


export interface ProfileJSON{
  success: boolean,
  data: Profile
}

export interface ReviewJSON{
  success: boolean,
  count: number,
  data: Review[]
}
export interface RestaurantJSON {
  success: boolean,
  count: number,
  data: Restaurant[],
  totalPages: number
}

export interface ReservationJSON {
  success: boolean
  count: number
  data: Reservation[]
}

export interface ReviewJSON {
  success: boolean,
  count: number,
  data: Review[],
  totalPages:number
}

export interface MenuJSON {
  success: boolean
  count: number,
  data: Menu[]
}
export interface User {
  name: string;
  tel: string;
  email: string;
  password: string;
}

export interface Queue {
  _id?: string;
  restaurant: string;
  user: string;
  seatCount: number;
  createdAt: Date;
  status: string;
}