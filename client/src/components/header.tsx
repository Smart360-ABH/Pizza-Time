import { ShoppingCart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";

export default function Header() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-montserrat font-bold text-primary">
              <svg className="inline-block w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Ваше Имя организации
            </div>
            <div className="hidden md:flex items-center text-sm text-secondary">
              <Clock className="w-4 h-4 mr-1" />
              Работаем с 09:00 до 00:00
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end text-sm">
              <div className="font-semibold text-secondary">+7 940 943 55 55</div>
              <div className="text-gray-600">г. Сухум ул.</div>
            </div>
            <Link href="/cart">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-semibold"
                data-testid="cart-button"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Корзина 
                {itemCount > 0 && (
                  <span className="bg-white text-primary rounded-full px-2 py-1 text-xs ml-1">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
