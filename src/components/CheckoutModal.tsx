import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  deliveryMethod: string;
  onPayment: (paymentData: PaymentData) => void;
}

export interface PaymentData {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: 'card' | 'sbp';
}

const CheckoutModal = ({ isOpen, onClose, total, deliveryMethod, onPayment }: CheckoutModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp'>('card');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await onPayment({
      name,
      email,
      phone,
      address,
      paymentMethod
    });
    
    setLoading(false);
  };

  const deliveryNames: Record<string, string> = {
    courier: 'Курьерская доставка',
    pickup: 'Самовывоз',
    express: 'Экспресс-доставка'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in" 
        onClick={onClose}
      />
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in border-2 border-green-300">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-2xl">Оформление заказа</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Контактные данные</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Имя и фамилия</Label>
                <Input
                  id="name"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {deliveryMethod !== 'pickup' && (
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес доставки</Label>
                  <Input
                    id="address"
                    placeholder="Улица, дом, квартира"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Способ оплаты</h3>
              
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'sbp')}>
                <div 
                  className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setPaymentMethod('card')}
                >
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon name="CreditCard" size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Банковская карта</p>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard, МИР</p>
                    </div>
                  </Label>
                </div>

                <div 
                  className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setPaymentMethod('sbp')}
                >
                  <RadioGroupItem value="sbp" id="sbp" />
                  <Label htmlFor="sbp" className="flex-1 cursor-pointer flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Icon name="Smartphone" size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">СБП (Система быстрых платежей)</p>
                      <p className="text-xs text-muted-foreground">Оплата через банковское приложение</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Доставка:</span>
                <span>{deliveryNames[deliveryMethod]}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Итого к оплате:</span>
                <span>{total.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Обработка...' : `Оплатить ${total.toLocaleString('ru-RU')} ₽`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutModal;
