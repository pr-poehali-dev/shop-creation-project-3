import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import CheckoutModal, { PaymentData } from '@/components/CheckoutModal';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const { toast } = useToast();

  const products: Product[] = [
    { id: 1, name: 'Беспроводные наушники', price: 8990, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', category: 'Аудио' },
    { id: 2, name: 'Умные часы', price: 15990, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', category: 'Аксессуары' },
    { id: 3, name: 'Минималистичный рюкзак', price: 4990, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', category: 'Сумки' },
    { id: 4, name: 'Портативная колонка', price: 6490, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop', category: 'Аудио' },
    { id: 5, name: 'Беспроводная мышь', price: 2990, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', category: 'Техника' },
    { id: 6, name: 'Клавиатура механическая', price: 9990, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop', category: 'Техника' },
  ];

  const categories = ['all', 'Аудио', 'Аксессуары', 'Сумки', 'Техника'];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCartItems(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = (delivery: string) => {
    setDeliveryMethod(delivery);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryPrices: Record<string, number> = {
      courier: 500,
      pickup: 0,
      express: 1000
    };
    return subtotal + (deliveryPrices[deliveryMethod] || 0);
  };

  const handlePayment = async (paymentData: PaymentData) => {
    try {
      const userId = localStorage.getItem('user_id');
      
      const orderData = {
        items: cartItems,
        delivery_method: deliveryMethod,
        payment_method: paymentData.paymentMethod,
        customer_name: paymentData.name,
        customer_email: paymentData.email,
        customer_phone: paymentData.phone,
        delivery_address: paymentData.address,
        total: calculateTotal(),
        user_id: userId ? parseInt(userId) : null
      };

      const response = await fetch('https://functions.poehali.dev/31fc2791-c211-4f2b-b639-edfac5243d9b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания заказа');
      }

      toast({
        title: 'Заказ оформлен!',
        description: `Номер заказа: ${data.order_id}`,
      });

      setCheckoutOpen(false);
      setCartItems([]);
      
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось оформить заказ',
        variant: 'destructive'
      });
    }
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const faqItems = [
    { question: 'Как оформить заказ?', answer: 'Добавьте товары в корзину и нажмите кнопку "Оформить заказ". Заполните форму с контактными данными и выберите способ оплаты.' },
    { question: 'Какие способы оплаты доступны?', answer: 'Мы принимаем оплату банковскими картами, электронными кошельками и наличными при получении.' },
    { question: 'Сколько времени занимает доставка?', answer: 'Доставка по Москве занимает 1-2 дня, по России - 3-7 дней в зависимости от региона.' },
    { question: 'Можно ли вернуть товар?', answer: 'Да, вы можете вернуть товар в течение 14 дней с момента получения, если он не был в употреблении.' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemsCount={totalCartItems} onCartOpen={() => setCartOpen(true)} />
      
      <main className="flex-1">
        <Hero />

        <section id="catalog" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Каталог товаров</h2>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="flex-wrap h-auto">
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat} className="px-6">
                  {cat === 'all' ? 'Все товары' : cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        <section id="about" className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">О магазине</h2>
              <p className="text-lg text-muted-foreground mb-6">
                STORE — это пространство, где минимализм встречается с функциональностью. 
                Мы тщательно отбираем каждый товар, чтобы предложить вам продукты с чистым дизайном и высоким качеством.
              </p>
              <p className="text-lg text-muted-foreground">
                Наша миссия — сделать ваш выбор проще, предлагая только то, что действительно важно.
              </p>
            </div>
          </div>
        </section>

        <section id="delivery" className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Доставка и оплата</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Truck" size={32} className="text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Быстрая доставка</h3>
                <p className="text-sm text-muted-foreground">По Москве — 1-2 дня, по России — 3-7 дней</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CreditCard" size={32} className="text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Удобная оплата</h3>
                <p className="text-sm text-muted-foreground">Картой онлайн, электронным кошельком или при получении</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={32} className="text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Гарантия качества</h3>
                <p className="text-sm text-muted-foreground">Возврат в течение 14 дней без объяснения причин</p>
              </div>
            </div>
          </div>
        </section>

        <section id="blog" className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Блог</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { title: 'Тренды минимализма 2024', date: '15 декабря 2024', image: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?w=500&h=300&fit=crop' },
                { title: 'Как выбрать качественные наушники', date: '10 декабря 2024', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=300&fit=crop' },
                { title: 'Уход за техникой: советы экспертов', date: '5 декабря 2024', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop' },
              ].map((post, idx) => (
                <div key={idx} className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground mb-2">{post.date}</p>
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Частые вопросы</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section id="contacts" className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Контакты</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Icon name="Phone" size={20} />
                  <span>+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Icon name="Mail" size={20} />
                  <span>hello@store.com</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Icon name="MapPin" size={20} />
                  <span>Москва, ул. Примерная, д. 1</span>
                </div>
              </div>
              <Button className="mt-8" size="lg">
                Написать нам
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        total={calculateTotal()}
        deliveryMethod={deliveryMethod}
        onPayment={handlePayment}
      />
    </div>
  );
};

export default Index;