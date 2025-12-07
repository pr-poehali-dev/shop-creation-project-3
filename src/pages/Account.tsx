import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  delivery_method: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  items: any[];
  created_at: string;
}

const Account = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const email = localStorage.getItem('user_email');

    if (!userId || !email) {
      navigate('/login');
      return;
    }

    setUserEmail(email);
    loadOrders(userId);
  }, [navigate]);

  const loadOrders = async (userId: string) => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/b1456864-8e77-4ff7-aacf-9081b5a8fce7?user_id=${userId}`
      );
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    navigate('/');
  };

  const deliveryNames: Record<string, string> = {
    courier: 'Курьерская доставка',
    pickup: 'Самовывоз',
    express: 'Экспресс-доставка'
  };

  const paymentNames: Record<string, string> = {
    card: 'Банковская карта',
    sbp: 'СБП'
  };

  const statusNames: Record<string, string> = {
    pending: 'Ожидает оплаты',
    paid: 'Оплачен',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemsCount={0} onCartOpen={() => {}} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
              <p className="text-muted-foreground">{userEmail}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={20} className="mr-2" />
              Выйти
            </Button>
          </div>

          <Card className="border-2 border-green-300">
            <CardHeader>
              <CardTitle>История заказов</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Загрузка...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Icon name="ShoppingBag" size={32} className="text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium mb-2">У вас пока нет заказов</p>
                  <p className="text-muted-foreground mb-4">Начните покупки в нашем каталоге</p>
                  <Button onClick={() => navigate('/')}>
                    Перейти в каталог
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-lg">Заказ {order.order_number}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.payment_status === 'paid' 
                                  ? 'bg-green-100 text-green-700'
                                  : order.payment_status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {statusNames[order.payment_status] || order.payment_status}
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Icon name="Calendar" size={16} />
                                <span>{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Truck" size={16} />
                                <span>{deliveryNames[order.delivery_method]}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="CreditCard" size={16} />
                                <span>{paymentNames[order.payment_method]}</span>
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="text-sm">
                                  {item.name} × {item.quantity} = {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Итого</p>
                            <p className="text-2xl font-bold">{order.total_amount.toLocaleString('ru-RU')} ₽</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
