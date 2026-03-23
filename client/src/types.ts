export interface Product {
    id: number
    name: string
    price: number
    category: string
}
export interface SelectedProduct extends Product {
    quantity: number
}
export interface ReceiptMessage {
    from: string;
    to:  string[];
    subject: string;
    text: string;
}

