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
    <Card className="group overflow-hidden border-2 border-green-300 shadow-sm hover:shadow-lg hover:border-green-400 transition-all duration-300">
      <CardContent className="p-0">
        <div className="aspect-square bg-secondary relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
          />
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {category}
          </p>
          <h3 className="text-lg font-semibold mb-3">{name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">{price.toLocaleString('ru-RU')} ₽</span>
            <Button
              size="icon"
              className="rounded-full bg-green-500 hover:bg-green-600 text-white"
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