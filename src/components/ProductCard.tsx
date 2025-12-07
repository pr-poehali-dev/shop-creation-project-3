import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  onAddToCart: (id: number) => void;
}

const ProductCard = ({ id, name, price, image, category, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-2 border-green-200 shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-300 bg-white">
      <CardContent className="p-0">
        <div className="aspect-square bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden p-8">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          />
        </div>
        <div className="p-6 bg-white">
          <p className="text-xs uppercase tracking-wider text-green-600 font-semibold mb-2">
            {category}
          </p>
          <h3 className="text-lg font-bold mb-3 text-gray-800">{name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-700">{price.toLocaleString('ru-RU')} ₽</span>
            <Button
              size="icon"
              className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all"
              onClick={() => onAddToCart(id)}
            >
              <Icon name="Plus" size={20} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;