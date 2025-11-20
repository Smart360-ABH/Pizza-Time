import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Minus, Plus, ShoppingCart, CreditCard, Trash2, Truck, Store, Banknote, CreditCard as CardIcon } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function CartOverlay() {
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice,
    clearCart 
  } = useCart();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryType: "delivery", // "delivery" or "pickup"
    paymentMethod: "cash" // "cash" or "transfer"
  });
  
  const { toast } = useToast();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity === 0) {
        removeFromCart(itemId);
      } else {
        updateQuantity(itemId, newQuantity);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const generateReceipt = () => {
    const orderText = cartItems.map(item => 
      `${item.menuItem.name} x${item.quantity} = ${Math.floor(parseFloat(item.menuItem.price) * item.quantity)} ₽`
    ).join('\n');
    
    const subtotal = parseInt(getTotalPrice());
    const deliveryFee = customerData.deliveryType === "delivery" ? 200 : 0;
    const total = subtotal + deliveryFee;
    
    return `🧾 ЧЕК Ваша организация
━━━━━━━━━━━━━━━━━━━━
${orderText}
━━━━━━━━━━━━━━━━━━━━
Подытог: ${subtotal} ₽${deliveryFee > 0 ? `\nДоставка: ${deliveryFee} ₽` : ''}
━━━━━━━━━━━━━━━━━━━━
ИТОГО: ${total} ₽

🎯 Способ получения: ${customerData.deliveryType === "delivery" ? "Доставка" : "Самовывоз"}
💳 Оплата: ${customerData.paymentMethod === "cash" ? "При получении" : "Банковский перевод"}

📞 Клиент: ${customerData.name}
📱 Телефон: ${customerData.phone}${customerData.deliveryType === "delivery" ? `\n📍 Адрес: ${customerData.address}` : '\n📍 Самовывоз: г. Сухум ул. Эшба 185'}

⏰ ${new Date().toLocaleString('ru-RU')}
`;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    const requiredFields = ['name', 'phone'];
    if (customerData.deliveryType === "delivery") {
      requiredFields.push('address');
    }
    
    const missingFields = requiredFields.filter(field => !customerData[field as keyof typeof customerData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Заполните все поля",
        description: "Для оформления заказа необходимо указать все данные",
        variant: "destructive"
      });
      return;
    }

    const receipt = generateReceipt();
    const subtotal = parseInt(getTotalPrice());
    const deliveryFee = customerData.deliveryType === "delivery" ? 200 : 0;
    const total = subtotal + deliveryFee;

    let paymentInfo = "";
    if (customerData.paymentMethod === "transfer") {
      paymentInfo = `\n💳 РЕКВИЗИТЫ ДЛЯ ОПЛАТЫ:
Карта Сбербанк: 0000 0000 0000 0000
Получатель: ИП Иванов И.И.
Сумма: ${total} ₽

⚠️ После перевода пришлите скриншот чека`;
    }

    const message = `${receipt}${paymentInfo}

🍕 Спасибо за заказ в Ваша организация!`;

    const whatsappUrl = `https://wa.me/79409435555?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Заказ отправлен!",
      description: "Ваш заказ отправлен в WhatsApp. Мы свяжемся с вами для подтверждения.",
    });
    
    clearCart();
    setShowCheckout(false);
    setCustomerData({ name: "", phone: "", address: "", deliveryType: "delivery", paymentMethod: "cash" });
    toggleCart();
  };

  if (!isCartOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={(e) => e.target === e.currentTarget && toggleCart()}
      data-testid="cart-overlay"
    >
      <div className="w-full max-w-md bg-white shadow-xl h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Ваша корзина</h3>
          <div className="flex items-center space-x-2">
            {cartItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:bg-destructive hover:text-white"
                data-testid="clear-cart"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              data-testid="close-cart"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Корзина пуста</p>
              <p className="text-sm mt-2">Добавьте товары из меню</p>
            </div>
          ) : showCheckout ? (
            <div className="p-6 space-y-6">
              <h4 className="text-lg font-semibold mb-4">Оформление заказа</h4>
              
              {/* Delivery Type Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">Способ получения</Label>
                <RadioGroup 
                  value={customerData.deliveryType} 
                  onValueChange={(value) => setCustomerData(prev => ({ ...prev, deliveryType: value }))}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex items-center cursor-pointer flex-1">
                      <Truck className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <div className="font-medium">Доставка</div>
                        <div className="text-sm text-gray-600">200 ₽ · 30-45 минут</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex items-center cursor-pointer flex-1">
                      <Store className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <div className="font-medium">Самовывоз</div>
                        <div className="text-sm text-gray-600">г. Сухум ул. · Бесплатно</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Method Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">Способ оплаты</Label>
                <RadioGroup 
                  value={customerData.paymentMethod} 
                  onValueChange={(value) => setCustomerData(prev => ({ ...prev, paymentMethod: value }))}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center cursor-pointer flex-1">
                      <Banknote className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <div className="font-medium">При получении</div>
                        <div className="text-sm text-gray-600">Наличными курьеру или в кафе</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="flex items-center cursor-pointer flex-1">
                      <CardIcon className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <div className="font-medium">Банковский перевод</div>
                        <div className="text-sm text-gray-600">Оплата по реквизитам</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    value={customerData.name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ваше имя"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+7 940 943 55 55"
                    data-testid="input-phone"
                  />
                </div>
                {customerData.deliveryType === "delivery" && (
                  <div>
                    <Label htmlFor="address">Адрес доставки *</Label>
                    <Textarea
                      id="address"
                      value={customerData.address}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Укажите точный адрес доставки в Сухуме"
                      data-testid="input-address"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6">
              {cartItems.map((item) => (
                <Card key={`cart-${item.menuItemId}-${item.id}`} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={item.menuItem.image} 
                        alt={item.menuItem.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">{item.menuItem.name}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.menuItem.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-bold text-lg">
                            {Math.floor(parseFloat(item.menuItem.price))} ₽
                          </span>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-gray-100 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                data-testid={`decrease-quantity-${item.menuItemId}`}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                data-testid={`increase-quantity-${item.menuItemId}`}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-white"
                              data-testid={`remove-item-${item.menuItemId}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700">
                            Итого: {Math.floor(parseFloat(item.menuItem.price) * item.quantity)} ₽
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6">
            {showCheckout ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base">Подытог:</span>
                    <span className="font-semibold">{getTotalPrice()} ₽</span>
                  </div>
                  {customerData.deliveryType === "delivery" && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base">Доставка:</span>
                      <span className="font-semibold">200 ₽</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Итого:</span>
                      <span className="text-2xl font-bold text-primary">
                        {parseInt(getTotalPrice()) + (customerData.deliveryType === "delivery" ? 200 : 0)} ₽
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1"
                    data-testid="back-to-cart"
                  >
                    Назад
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 bg-success hover:bg-success/90 text-white font-semibold"
                    data-testid="confirm-order"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                    </svg>
                    Заказать в WhatsApp
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Итого:</span>
                  <span className="text-2xl font-bold text-primary">{getTotalPrice()} ₽</span>
                </div>
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-lg"
                  data-testid="proceed-to-checkout"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Оформить заказ
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
