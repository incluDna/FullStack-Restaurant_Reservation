export interface User {
    name: string;
    telephone: string;
    email: string;
    password: string;
}

export interface Menu {
    name: string;
    restaurant: string;
    picture: string;
    price: number;
    type: string;
    description: string;
    tag: string[];
}