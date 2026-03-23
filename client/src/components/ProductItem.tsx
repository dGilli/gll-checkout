import React from 'react';
import { PlusIcon } from 'lucide-react';
import { Product } from '../types';
interface ProductItemProps {
    product: Product;
    onAddProduct: (product: Product) => void;
}
const ProductItem: React.FC<ProductItemProps> = ({
    product,
    onAddProduct
}) => {
    return <div onClick={() => onAddProduct(product)} className="h-full bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col justify-between">
        <div>
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="text-gray-500 text-sm capitalize">{product.category}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-semibold">
                {product.price.toFixed(2)} Fr.
            </span>
            <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors" aria-label={`${product.name} in den Warenkorb legen`}>
                <PlusIcon size={18} />
            </button>
        </div>
    </div>;
};
export default ProductItem;
