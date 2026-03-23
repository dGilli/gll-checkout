import React, { useMemo } from 'react';
import { SelectedProduct } from '../types';
interface TotalDisplayProps {
    selectedProducts: SelectedProduct[];
    onCompleteSale: () => void
}
const TotalDisplay: React.FC<TotalDisplayProps> = ({
  selectedProducts,
  onCompleteSale,
}) => {
    const {
        subtotal,
        itemCount
    } = useMemo(() => {
        const subtotal = selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2);
        const itemCount = selectedProducts.reduce((count, product) => count + product.quantity, 0);
        return {
            subtotal,
            itemCount
        };
    }, [selectedProducts]);
    return <div className="bg-blue-600 text-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
            <span>Artikel:</span>
            <span>{itemCount}</span>
        </div>
        <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>{subtotal} Fr.</span>
        </div>
        <button onClick={onCompleteSale} disabled={itemCount === 0} className={`w-full py-3 px-4 rounded-md mt-4 font-medium transition-colors ${itemCount === 0 ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
            Kauf abschliessen
        </button>
    </div>;
};
export default TotalDisplay;
