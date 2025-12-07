import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  cartItemsCount: number;
  onCartOpen: () => void;
}

const Header = ({ cartItemsCount, onCartOpen }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    setIsLoggedIn(!!userId);
  }, []);

  const navigation = [
    { name: 'Каталог', href: '#catalog' },
    { name: 'О магазине', href: '#about' },
    { name: 'Доставка', href: '#delivery' },
    { name: 'Блог', href: '#blog' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Контакты', href: '#contacts' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="text-2xl font-bold tracking-tight">
              STORE
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Icon name="Search" size={20} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex"
                onClick={() => navigate(isLoggedIn ? '/account' : '/login')}
              >
                <Icon name="User" size={20} />
              </Button>

              <Button variant="ghost" size="icon" className="relative" onClick={onCartOpen}>
                <Icon name="ShoppingCart" size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className="absolute right-0 top-16 h-[calc(100vh-4rem)] w-[300px] bg-white p-6 shadow-lg overflow-y-auto">
            <div className="flex flex-col gap-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="border-t pt-6 space-y-4">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Icon name="Search" size={20} />
                  Поиск
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    navigate(isLoggedIn ? '/account' : '/login');
                    setIsMenuOpen(false);
                  }}
                >
                  <Icon name="User" size={20} />
                  {isLoggedIn ? 'Личный кабинет' : 'Войти'}
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;