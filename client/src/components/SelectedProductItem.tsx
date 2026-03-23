import React from 'react';
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react';
import { SelectedProduct } from '../types';
interface SelectedProductItemProps {
    product: SelectedProduct;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemoveProduct: (id: number) => void;
}
const SelectedProductItem: React.FC<SelectedProductItemProps> = ({
    product,
    onUpdateQuantity,
    onRemoveProduct
}) => {
    const totalPrice = product.price * product.quantity;
    return <div className="flex items-center p-3 border border-gray-200 rounded-lg @container">
        <div className="w-full flex items-center justify-between flex-wrap flex-1 pr-1">
            <div className="w-full flex">
                <div className="w-full mb-1 @xs:mb-0">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">
                        {product.price.toFixed(2)} Fr. pro Stück
                    </p>
                </div>
                <div class="-mt-2 -mr-3">
                    <button onClick={() => onRemoveProduct(product.id)} className="p-1 text-gray-500 hover:text-red-500" aria-label={`Remove ${product.name}`}>
                        <XIcon size={18} />
                    </button>
                </div>
            </div>
            <div className="w-full flex items-center space-x-2">
                <div className="flex items-center border border-gray-300 rounded-md">
                    <button onClick={() => onUpdateQuantity(product.id, product.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100" aria-label="Decrease quantity">
                        <MinusIcon size={16} />
                    </button>
                    <span className="py-1 min-w-[20px] text-center">
                        {product.quantity}
                    </span>
                    <button onClick={() => onUpdateQuantity(product.id, product.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100" aria-label="Increase quantity">
                        <PlusIcon size={16} />
                    </button>
                </div>
                <div className="min-w-[60px] text-right font-medium">
                    {totalPrice.toFixed(2)} Fr.
                </div>
            </div>
        </div>
    </div>;
};
export default SelectedProductItem;
