import React from 'react';
import ProductItem from './ProductItem';
import { Product } from '../types';
interface ProductListProps {
    products: Product[];
    onAddProduct: (product: Product) => void;
}
const ProductList: React.FC<ProductListProps> = ({
    products,
    onAddProduct
}) => {
    if (products.length === 0) {
        return <div className="text-center py-8 text-gray-500">
            Keine Produkte gefunden. Versuchen Sie eine andere Suche oder Kategorie.
        </div>;
    }
    //return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 h-full gap-4 content-start overflow-y-scroll">
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
        {products.map(product => <ProductItem key={product.id} product={product} onAddProduct={onAddProduct} />)}
    </div>;
};
export default ProductList;
