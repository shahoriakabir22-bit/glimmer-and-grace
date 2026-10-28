import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types/product';
import { fetchProducts, saveProduct, removeProduct, seedProductsToFirestore } from '../lib/firestoreService';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
  createOrUpdateProduct: (product: Partial<Product> & { name: string; category: Product['category']; price: number }) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  resetCatalog: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const items = await fetchProducts();
      setProducts(items);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const createOrUpdateProduct = async (productData: Partial<Product> & { name: string; category: Product['category']; price: number }) => {
    const saved = await saveProduct(productData);
    await loadCatalog();
    return saved;
  };

  const deleteProduct = async (id: string) => {
    const res = await removeProduct(id);
    await loadCatalog();
    return res;
  };

  const resetCatalog = async () => {
    setLoading(true);
    await seedProductsToFirestore();
    await loadCatalog();
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      refreshProducts: loadCatalog,
      createOrUpdateProduct,
      deleteProduct,
      resetCatalog
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
