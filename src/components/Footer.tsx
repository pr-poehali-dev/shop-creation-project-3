import Icon from '@/components/ui/icon';

const Footer = () => {
  const footerLinks = {
    'О магазине': [
      { name: 'О нас', href: '#about' },
      { name: 'Контакты', href: '#contacts' },
      { name: 'Вакансии', href: '#' },
    ],
    'Покупателям': [
      { name: 'Доставка', href: '#delivery' },
      { name: 'Оплата', href: '#' },
      { name: 'Возврат', href: '#' },
      { name: 'FAQ', href: '#faq' },
    ],
    'Сервисы': [
      { name: 'Блог', href: '#blog' },
      { name: 'Личный кабинет', href: '#' },
      { name: 'Отследить заказ', href: '#' },
    ],
  };

  return (
    <footer className="border-t bg-secondary mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">STORE</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Минималистичный дизайн и качество в каждой детали
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="Instagram" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="Facebook" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="Twitter" size={20} />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 STORE. Все права защищены</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
