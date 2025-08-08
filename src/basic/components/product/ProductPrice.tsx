import { ProductWithUI } from '../../../types';
import {
  commaizedNumberWithUnit,
  commaziedNumberWithCurrency,
} from '../../../shared/utils/commaizedNumber';

interface ProductPriceProps {
  product: ProductWithUI;
  isAdmin: boolean;
  remainingStock: number;
}

export function ProductPrice({ product, isAdmin, remainingStock }: ProductPriceProps) {
  if (remainingStock <= 0) return <SoldOutPrice />;
  if (isAdmin) return <AdminPrice price={product.price} />;
  return <UserPrice price={product.price} />;
}

const SoldOutPrice = () => <span className="text-red-600 font-bold">SOLD OUT</span>;

const AdminPrice = ({ price }: { price: number }) => (
  <span className="font-medium">{commaizedNumberWithUnit(price, '원')}</span>
);

const UserPrice = ({ price }: { price: number }) => (
  <span className="font-medium">{commaziedNumberWithCurrency(price, '₩')}</span>
);
