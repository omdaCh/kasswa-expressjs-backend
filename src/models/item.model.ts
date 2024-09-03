export type ItemSize = { name: string, available: boolean };

export type ItemColor = { colorName: string, sizes: ItemSize[], photos: string[] };

export type ItemBrand = { name: string, photoUrl: string };

export interface IItem {
  id: number;
  name: string;
  description: string;
  colors: ItemColor[];
  price: number;
  discountedPrice: number;
  nbrSold: number;
  rating: number;
  numberOfReviews: number;
  brand?: ItemBrand;
  gender: 'male' | 'female';
  age: 'Kids' | 'Adulte';
  category: string;
  shippingCoast: number;
}

export type NewItem = Omit<IItem, 'id'> & { id: null };
