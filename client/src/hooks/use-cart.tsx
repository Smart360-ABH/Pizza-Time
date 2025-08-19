import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CartItem, MenuItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Generate a simple session ID for cart tracking
const getSessionId = () => {
  let sessionId = localStorage.getItem("pizza-time-session");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem("pizza-time-session", sessionId);
  }
  return sessionId;
};

export function useCart() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sessionId] = useState(getSessionId);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: cartItems = [] } = useQuery<(CartItem & { menuItem: MenuItem })[]>({
    queryKey: ["/api/cart", sessionId],
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ menuItemId, quantity }: { menuItemId: string; quantity: number }) => {
      return apiRequest("POST", "/api/cart", {
        menuItemId,
        quantity,
        sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${cartItemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить количество",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId: string) => {
      return apiRequest("DELETE", `/api/cart/${cartItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар из корзины",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/cart/clear/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const addToCart = async (menuItemId: string, quantity: number = 1) => {
    await addToCartMutation.mutateAsync({ menuItemId, quantity });
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ cartItemId, quantity });
  };

  const removeFromCart = async (cartItemId: string) => {
    await removeFromCartMutation.mutateAsync(cartItemId);
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.menuItem.price) * item.quantity;
    }, 0).toFixed(0);
  };

  return {
    cartItems,
    isCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleCart,
    getTotalPrice,
    isLoading: addToCartMutation.isPending || updateQuantityMutation.isPending || removeFromCartMutation.isPending,
  };
}
