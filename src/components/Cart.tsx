import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: (deliveryMethod: string) => void;
}

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) => {
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const deliveryPrices: Record<string, number> = {
    courier: 500,
    pickup: 0,
    express: 1000
  };
  
  const deliveryPrice = deliveryPrices[deliveryMethod] || 0;
  const total = subtotal + deliveryPrice;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in" 
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Корзина</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Icon name="ShoppingCart" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">Корзина пуста</p>
            <p className="text-muted-foreground">Добавьте товары из каталога</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-24 bg-secondary rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-2 truncate">{item.name}</h4>
                    <p className="text-sm font-semibold mb-3">
                      {item.price.toLocaleString('ru-RU')} ₽
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Icon name="Minus" size={16} />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="flex-shrink-0"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Icon name="Trash2" size={20} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t p-6 space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Способ доставки</h3>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50" onClick={() => setDeliveryMethod('courier')}>
                    <RadioGroupItem value="courier" id="courier" />
                    <Label htmlFor="courier" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Курьерская доставка</p>
                          <p className="text-xs text-muted-foreground">1-2 дня</p>
                        </div>
                        <span className="font-semibold">500 ₽</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50" onClick={() => setDeliveryMethod('pickup')}>
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Самовывоз</p>
                          <p className="text-xs text-muted-foreground">Сегодня</p>
                        </div>
                        <span className="font-semibold text-green-600">Бесплатно</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50" onClick={() => setDeliveryMethod('express')}>
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Экспресс-доставка</p>
                          <p className="text-xs text-muted-foreground">3-4 часа</p>
                        </div>
                        <span className="font-semibold">1000 ₽</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Товары:</span>
                  <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Доставка:</span>
                  <span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toLocaleString('ru-RU')} ₽`}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Итого:</span>
                  <span>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white" 
                size="lg"
                onClick={() => onCheckout(deliveryMethod)}
              >
                Перейти к оплате
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;