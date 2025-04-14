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
  
export interface RestaurantJSON {
    count: number
    data: Restaurant[]
    totalPages: number
}
