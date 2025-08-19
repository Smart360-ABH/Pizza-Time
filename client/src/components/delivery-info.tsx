import { Bike, Clock, MapPin } from "lucide-react";

export default function DeliveryInfo() {
  return (
    <section className="bg-secondary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-montserrat font-bold mb-4">Быстрая доставка по Сухуму</h2>
          <p className="text-xl opacity-90">Привозим горячую еду прямо к вашему порогу</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Bike className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Бесплатная доставка</h3>
            <p className="opacity-90">При заказе от 500 рублей доставляем бесплатно</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Быстро</h3>
            <p className="opacity-90">Среднее время доставки 30-45 минут</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Везде в Сухуме</h3>
            <p className="opacity-90">Доставляем по всему городу без исключения</p>
          </div>
        </div>
      </div>
    </section>
  );
}
