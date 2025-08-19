import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import CategoryNavigation from "@/components/category-navigation";
import ProductCard from "@/components/product-card";
import DeliveryInfo from "@/components/delivery-info";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Pizza, Leaf, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: "pizza", name: "Пицца", icon: Pizza },
  { id: "salads", name: "Салаты", icon: Leaf },
  { id: "burgers", name: "Бургеры", icon: ShoppingCart },
  { id: "khachapuri", name: "Хачапуры", icon: Star },
  { id: "souvlaki", name: "Сувлаки", icon: ShoppingCart },
  { id: "shawarma", name: "Шаурма", icon: ShoppingCart },
  { id: "snacks", name: "Закуски", icon: ShoppingCart },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("pizza");

  const { data: menuItems, isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const filteredItems = menuItems?.filter(item => item.category === activeCategory) || [];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary mb-2">Ошибка загрузки</h1>
          <p className="text-gray-600">Не удалось загрузить меню. Попробуйте обновить страницу.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <CategoryNavigation 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-16">
          {categories.map(category => (
            <div 
              key={category.id}
              id={category.id}
              className={activeCategory === category.id ? "block" : "hidden"}
            >
              <h2 className="text-3xl font-montserrat font-bold text-secondary mb-8 flex items-center">
                <category.icon className="text-primary mr-3" size={36} />
                {category.name}
              </h2>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <Skeleton className="w-full h-48" />
                      <div className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-10 w-24" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredItems.map((item) => (
                    <ProductCard 
                      key={item.id} 
                      item={item}
                      variant="default"
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </section>
      </main>

      <DeliveryInfo />
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/79407442255"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-success hover:bg-success/90 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-colors duration-200 z-50"
        data-testid="whatsapp-float"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
        </svg>
      </a>
    </div>
  );
}
