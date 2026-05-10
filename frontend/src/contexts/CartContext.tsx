import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

import { Product } from "@/data/mockData";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  // ✅ LOAD cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // ✅ SAVE cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // ✅ ADD ITEM
  const addItem = useCallback((product: Product, size?: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.product.id === product.id &&
          i.size === size
      );

      // if same product + same size already exists
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id &&
          i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      // add new item
      return [...prev, { product, quantity: 1, size }];
    });

    setIsOpen(true);
  }, []);

  // ✅ REMOVE ITEM
  const removeItem = useCallback((productId: string) => {
    setItems((prev) =>
      prev.filter((i) => i.product.id !== productId)
    );
  }, []);

  // ✅ UPDATE QUANTITY
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      // remove item if quantity becomes 0
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((i) => i.product.id !== productId)
        );

        return;
      }

      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId
            ? { ...i, quantity }
            : i
        )
      );
    },
    []
  );

  // ✅ CLEAR ENTIRE CART
  const clearCart = useCallback(() => {
    setItems([]);

    localStorage.removeItem("cart");
  }, []);

  // ✅ TOTAL ITEMS
  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // ✅ TOTAL PRICE
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + item.product.prod_actualPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
};