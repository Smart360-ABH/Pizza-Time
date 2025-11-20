import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

export default function HeroSection() {
  const scrollToMenu = () => {
    document.getElementById('pizza')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="relative bg-gradient-to-r from-primary to-orange-500 text-white py-16 overflow-hidden">
      {/* Hero background with appetizing pizza image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Delicious pizza background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-4">
            Вкусная доставка в Сухуме!
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Пицца и салаты с бесплатной доставкой. Большие порции, натуральные ингредиенты.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={scrollToMenu}
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg"
              data-testid="scroll-to-menu"
            >
              <Utensils className="w-5 h-5 mr-2" />
              Смотреть меню
            </Button>
            <Button 
              asChild
              variant="secondary"
              size="lg"
              className="bg-success hover:bg-success/90 text-white text-lg"
              data-testid="whatsapp-order"
            >
              <a href="https://wa.me/79409435555" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
                WhatsApp заказ
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Promotional banner */}
      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold animate-pulse text-lg">
        <svg className="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Скидка 10% по промокоду!
      </div>
    </section>
  );
}
