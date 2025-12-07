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
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-square bg-secondary relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
              variant="outline"
              className="rounded-full"
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