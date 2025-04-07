import { PickerValueUpdateAction } from "@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types"
import mongoose from "mongoose"

export interface ReservationItem{
    _id?: string,
    resDate:string,
    user:mongoose.Types.ObjectId,
    restaurant:mongoose.Types.ObjectId,
    quantity:string
}
export interface ReservationJson{
  success: boolean,
  count: number,
  pagination: Object,
  data: ReservationItem[]
}
export interface MeanReviewItem{
  success:string,
  name:string,
  totalRating:number,
  count:number
}

export interface RestaurantItem{
    _id: string,
    name: string,
    address: string,
    district: string,
    province: string,
    postalcode: string,
    tel: string,
    shortLocation:string,    
    region: string,
    openTime: string,    
    closeTime: string,    
    picture: string
}
export interface RestaurantJson{
    success: boolean,
    count: number,
    pagination: Object,
    data: RestaurantItem[]
}
export interface ReviewItem{
  _id?: string,
  user: string,
  restaurant: string,
  reviewStar: string,
  reviewText: string,
}
export interface ReviewJson{
  success: boolean,
  count: number,
  pagination: Object,
  data: ReviewItem[]
}

export interface ProfileItem{
  _id?: string,
  name: string,
  tel: string,
  email: string,
  role: string  
  createdAt:string,

}

export interface ProfileJson{
  success: boolean,
  data: ProfileItem[]
}

  export interface BookingItem {
    nameLastname: string;
    tel: string;
    venue: string;
    bookDate: string;
  }