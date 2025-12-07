import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Hero = () => {
  return (
    <section className="relative bg-secondary py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Минимализм в каждой детали
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Откройте для себя коллекцию товаров, где чистота дизайна встречается с безупречным качеством
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              Смотреть каталог
              <Icon name="ArrowRight" size={20} />
            </Button>
            <Button size="lg" variant="outline">
              О магазине
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
