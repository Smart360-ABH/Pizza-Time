import { type MenuItem, type InsertMenuItem, type CartItem, type InsertCartItem, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItemById(id: string): Promise<MenuItem | undefined>;
  
  // Cart Items
  getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<string, MenuItem>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;

  constructor() {
    this.menuItems = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    
    // Initialize with sample menu data
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    const items: MenuItem[] = [
      {
        id: "pizza-1",
        name: "Овощная",
        description: "Свежие овощи, томатный соус, сыр",
        price: "450.00",
        image: "/images/pizza/assorti.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-2",
        name: "Цезарь",
        description: "Курица, салат Романо, пармезан, соус Цезарь",
        price: "500.00",
        image: "/images/pizza/carbonara.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-3",
        name: "Пепперони",
        description: "Пепперони, моцарелла, томатный соус",
        price: "400.00",
        image: "/images/pizza/cezar.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-4",
        name: "Мясная",
        description: "Ассорти мясных топпингов, сыр, соус",
        price: "480.00",
        image: "/images/pizza/four-cheese.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-5",
        name: "Ассорти",
        description: "Сборная пицца с разными вкусами",
        price: "500.00",
        image: "/images/pizza/gorodskaya.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-6",
        name: "Мексиканская",
        description: "Острый перец, кукуруза, соус сальса, сыр",
        price: "500.00",
        image: "/images/pizza/margherita.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-7",
        name: "Четыре сыра",
        description: "Моцарелла, дорблю, пармезан, чеддер",
        price: "500.00",
        image: "/images/pizza/myasnaya.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-8",
        name: "Песто",
        description: "Соус песто, моцарелла, томаты",
        price: "450.00",
        image: "/images/pizza/ovoshchnaya.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-9",
        name: "Городская",
        description: "Классическое городское сочетание",
        price: "500.00",
        image: "/images/pizza/pepperoni.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-10",
        name: "Маргарита",
        description: "Томатный соус, моцарелла, базилик",
        price: "400.00",
        image: "/images/pizza/pesto.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-11",
        name: "Карбонара",
        description: "Сливочный соус, бекон, пармезан, яйцо",
        price: "450.00",
        image: "/images/pizza/time.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "pizza-12",
        name: "Тайм",
        description: "Фирменная пицца Pizza Time",
        price: "450.00",
        image: "/images/pizza/assorti.jpg",
        category: "pizza",
        isAvailable: "true"
      },
      {
        id: "burger-1",
        name: "Эгг-бургер",
        description: "С сочной котлетой и яйцом",
        price: "350.00",
        image: "/images/burgers/beefburger.jpg",
        category: "burgers",
        isAvailable: "true"
      },
      {
        id: "burger-2",
        name: "Корпоратив бургер",
        description: "Большой бургер с фирменным соусом",
        price: "400.00",
        image: "/images/burgers/cheeseburger.jpg",
        category: "burgers",
        isAvailable: "true"
      },
      {
        id: "burger-3",
        name: "Чикен бургер",
        description: "Хрустящая курица, салат, соус",
        price: "350.00",
        image: "/images/burgers/chicken-burger.jpg",
        category: "burgers",
        isAvailable: "true"
      },
      {
        id: "burger-4",
        name: "Чизбургер",
        description: "Говяжья котлета, сыр чеддер",
        price: "300.00",
        image: "/images/burgers/corporate-burger.jpg",
        category: "burgers",
        isAvailable: "true"
      },
      {
        id: "burger-5",
        name: "Бифбургер",
        description: "Двойная говяжья котлета, соус",
        price: "0.00",
        image: "/images/burgers/egg-burger.jpg",
        category: "burgers",
        isAvailable: "true"
      },
      {
        id: "khach-1",
        name: "Обычный",
        description: "Классический хачапури с сыром",
        price: "400.00",
        image: "/images/khachapuri/khachapuri-boat-egg.jpg",
        category: "khachapuri",
        isAvailable: "true"
      },
      {
        id: "khach-2",
        name: "Лодочка",
        description: "Аджарский хачапури-лодочка",
        price: "300.00",
        image: "/images/khachapuri/khachapuri-round.jpg",
        category: "khachapuri",
        isAvailable: "true"
      },
      {
        id: "khach-3",
        name: "На мангале",
        description: "Хачапури, приготовленный на мангале",
        price: "450.00",
        image: "/images/khachapuri/khachapuri-boat-egg.jpg",
        category: "khachapuri",
        isAvailable: "true"
      },
      {
        id: "souv-1",
        name: "Открытый",
        description: "Подача на тарелке с гарниром",
        price: "350.00",
        image: "/images/souvlaki/classic-souvlaki.jpg",
        category: "souvlaki",
        isAvailable: "true"
      },
      {
        id: "souv-2",
        name: "Обычный",
        description: "Классический сувлаки в пите",
        price: "350.00",
        image: "/images/souvlaki/lavash-souvlaki.jpg",
        category: "souvlaki",
        isAvailable: "true"
      },
      {
        id: "souv-3",
        name: "В лаваше",
        description: "Сувлаки, завёрнутый в лаваш",
        price: "300.00",
        image: "/images/souvlaki/classic-souvlaki.jpg",
        category: "souvlaki",
        isAvailable: "true"
      },
      {
        id: "shaw-1",
        name: "Обычная",
        description: "Классическая шаурма",
        price: "300.00",
        image: "/images/shawarma/shawarma-fries.jpg",
        category: "shawarma",
        isAvailable: "true"
      },
      {
        id: "shaw-2",
        name: "С картошкой",
        description: "Шаурма с картофелем фри внутри",
        price: "350.00",
        image: "/images/shawarma/shawarma-regular.jpg",
        category: "shawarma",
        isAvailable: "true"
      },
      {
        id: "snack-1",
        name: "Картошка фри",
        description: "Классические хрустящие фри",
        price: "200.00",
        image: "/images/snacks/country-potatoes.jpg",
        category: "snacks",
        isAvailable: "true"
      },
      {
        id: "snack-2",
        name: "Картошка по-деревенски",
        description: "Запечённые дольки картофеля",
        price: "200.00",
        image: "/images/snacks/fries.jpg",
        category: "snacks",
        isAvailable: "true"
      },
      {
        id: "snack-3",
        name: "Наггетсы (10 шт)",
        description: "Куриные наггетсы, 10 штук",
        price: "250.00",
        image: "/images/snacks/hot-dog.jpg",
        category: "snacks",
        isAvailable: "true"
      },
      {
        id: "snack-4",
        name: "Хот-дог",
        description: "Классический хот-дог",
        price: "250.00",
        image: "/images/snacks/nuggets.jpg",
        category: "snacks",
        isAvailable: "true"
      },
      {
        id: "snack-5",
        name: "Твистер",
        description: "Ролл в лаваше с курицей",
        price: "250.00",
        image: "/images/snacks/twister.jpg",
        category: "snacks",
        isAvailable: "true"
      },
    
    
    
    
    
    ];

    items.forEach(item => {
      this.menuItems.set(item.id, item);
    });
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.category === category);
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem })[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);
    
    return items.map(item => {
      const menuItem = this.menuItems.get(item.menuItemId);
      if (!menuItem) throw new Error(`Menu item not found: ${item.menuItemId}`);
      return { ...item, menuItem };
    });
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values())
      .find(item => item.sessionId === insertItem.sessionId && item.menuItemId === insertItem.menuItemId);
    
    if (existingItem) {
      // Update quantity
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + insertItem.quantity };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    } else {
      // Create new cart item
      const id = randomUUID();
      const cartItem: CartItem = { ...insertItem, id };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToRemove = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);
    
    itemsToRemove.forEach(item => {
      this.cartItems.delete(item.id);
    });
    
    return true;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date().toISOString(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

export const storage = new MemStorage();
