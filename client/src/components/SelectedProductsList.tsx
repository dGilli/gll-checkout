import React from 'react';
import SelectedProductItem from './SelectedProductItem';
import { SelectedProduct } from '../types';
interface SelectedProductsListProps {
    selectedProducts: SelectedProduct[];
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemoveProduct: (id: number) => void;
}
const SelectedProductsList: React.FC<SelectedProductsListProps> = ({
    selectedProducts,
    onUpdateQuantity,
    onRemoveProduct
}) => {
    if (selectedProducts.length === 0) {
        return <div className="text-center py-8 text-gray-500">
            Noch keine Produkte ausgewählt.
        </div>;
    }
    return <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
        {selectedProducts.map(product => <SelectedProductItem key={product.id} product={product} onUpdateQuantity={onUpdateQuantity} onRemoveProduct={onRemoveProduct} />)}
    </div>;
};
export default SelectedProductsList;
