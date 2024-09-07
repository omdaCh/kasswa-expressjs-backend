export interface IOrder {
    id?: number;
    date?: Date;
    status: 'pending' | 'completed' | 'shipped' | 'cancelled';
    orderItems: OrderItem[];
    subTotal: number;
    totalShipping: number;
    totalQuantity: number;
    totalPrice: number;
}

export class Order implements IOrder {
    constructor(
        public status: 'pending' | 'completed' | 'shipped' | 'cancelled',
        public orderItems: OrderItem[],
        public subTotal: number,
        public totalShipping: number,
        public totalQuantity: number,
        public totalPrice: number,
        public id?: number,
        public date?: Date,
    ) { }
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };

export interface IOrderItem {
    id: number;
    orderId: number;
    itemId: number;
    itemName: string;
    color: string,
    colorPhotoUrl?: string,
    size: string,
    quantity: number;
    price: number;
    totalPrice: number;
    shippingCoast: number;
    totalShipping: number;

}

export class OrderItem {
    constructor(
        public id: number,
        public orderId: number,
        public itemId: number,
        public itemName: string,
        public color: string,
        public colorPhotoUrl: string,
        public size: string,
        public quantity: number,
        public price: number,
        public totalPrice: number,
        public shippingCoast: number,
        public totalShipping: number
    ) { }
}