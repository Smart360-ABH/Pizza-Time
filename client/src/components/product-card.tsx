import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItem } from "@shared/schema";
import { Plus, Check, Minus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

interface ProductCardProps {
  item: MenuItem;
  variant?: "default" | "compact" | "combo";
}

export default function ProductCard({ item, variant = "default" }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Find if this item is already in cart
  const cartItem = cartItems.find(cartItem => cartItem.menuItemId === item.id);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async () => {
    try {
      await addToCart(item.id, quantity);
      setIsAdded(true);
      setQuantity(1); // Reset quantity after adding
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return Math.floor(numPrice).toString() + " ₽";
  };

  if (variant === "combo") {
    return (
      <Card className="bg-gradient-to-br from-accent to-orange-400 text-white overflow-hidden relative">
        <div className="absolute top-4 right-4 bg-white text-accent px-3 py-1 rounded-full font-bold text-sm">
          СКИДКА 30%
        </div>
        <CardContent className="p-8">
          <h3 className="text-2xl font-montserrat font-bold mb-4">{item.name}</h3>
          <p className="mb-6 opacity-90">{item.description}</p>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm opacity-75 line-through">
                {Math.floor(parseFloat(item.price) * 1.4)} ₽
              </span>
              <span className="text-3xl font-bold ml-2">{formatPrice(item.price)}</span>
            </div>
            <Button
              onClick={handleAddToCart}
              variant="secondary"
              className="bg-white text-accent hover:bg-gray-100"
              data-testid={`add-to-cart-${item.id}`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Добавлено
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1h8c.55 0 1 .45 1 1v2h5c.55 0 1 .45 1 1s-.45 1-1 1H20v15c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6H2c-.55 0-1-.45-1-1s.45-1 1-1h5zm3-1v1h4V3h-4zm7 4.5c0-.83-.67-1.5-1.5-1.5S14 6.67 14 7.5 14.67 9 15.5 9 17 8.33 17 7.5zm-8 0C9 6.67 8.33 6 7.5 6S6 6.67 6 7.5 6.67 9 7.5 9 9 8.33 9 7.5z"/>
                  </svg>
                  Заказать сет
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <img 
        src={item.image} 
        alt={item.name}
        className={`w-full object-cover ${variant === "compact" ? "h-32" : "h-48"}`}
      />
      <CardContent className={variant === "compact" ? "p-4" : "p-6"}>
        <h3 className={`font-semibold text-secondary mb-2 ${variant === "compact" ? "text-lg" : "text-xl"}`}>
          {item.name}
        </h3>
        <p className={`text-gray-600 mb-${variant === "compact" ? "3" : "4"} ${variant === "compact" ? "text-sm" : ""}`}>
          {item.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className={`font-bold text-primary ${variant === "compact" ? "text-lg" : "text-2xl"}`}>
              {formatPrice(item.price)}
            </span>
            {inCartQuantity > 0 && (
              <span className="text-sm text-success font-medium">
                В корзине: {inCartQuantity} шт.
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            {/* Quantity selector */}
            <div className="flex items-center bg-gray-100 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={decrementQuantity}
                className="h-8 w-8 p-0 hover:bg-gray-200"
                data-testid={`decrease-quantity-${item.id}`}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center font-medium text-sm">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={incrementQuantity}
                className="h-8 w-8 p-0 hover:bg-gray-200"
                data-testid={`increase-quantity-${item.id}`}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {/* Add to cart button */}
            <Button
              onClick={handleAddToCart}
              className={`bg-primary hover:bg-primary/90 text-white font-semibold transition-colors duration-200 ${
                isAdded ? "bg-success hover:bg-success/90" : ""
              } ${variant === "compact" ? "px-3 py-1 text-sm" : ""}`}
              data-testid={`add-to-cart-${item.id}`}
            >
              {isAdded ? (
                <>
                  <Check className={`mr-1 ${variant === "compact" ? "w-3 h-3" : "w-4 h-4"}`} />
                  Добавлено
                </>
              ) : (
                <>
                  <Plus className={`mr-1 ${variant === "compact" ? "w-3 h-3" : "w-4 h-4"}`} />
                  {quantity > 1 ? `Добавить ${quantity} шт.` : "В корзину"}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
