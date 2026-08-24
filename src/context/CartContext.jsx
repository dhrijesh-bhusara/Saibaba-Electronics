import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const CartContext = createContext(null);
const GUEST_CART_KEY = 'saibaba_guest_cart';
const GUEST_WISHLIST_KEY = 'saibaba_guest_wishlist';

function readStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function getProductId(product) {
  return product?.id ?? product?.product_id;
}

function storageKey(prefix, userId, guestKey) {
  return userId ? `${prefix}_${userId}` : guestKey;
}

function mergeProducts(existing, additions, wishlistOnly = false) {
  const merged = [...existing];
  additions.forEach((product) => {
    const id = getProductId(product);
    const index = merged.findIndex((item) => getProductId(item) === id);
    if (index === -1) merged.push(wishlistOnly ? product : { ...product, quantity: product.quantity || 1 });
    else if (!wishlistOnly) merged[index] = { ...merged[index], quantity: (merged[index].quantity || 1) + (product.quantity || 1) };
  });
  return merged;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadedKey, setLoadedKey] = useState(null);

  useEffect(() => {
    let active = true;
    const cartKey = storageKey('saibaba_cart', userId, GUEST_CART_KEY);
    const wishlistKey = storageKey('saibaba_wishlist', userId, GUEST_WISHLIST_KEY);
    // Clear the previous identity before loading the next identity's data.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadedKey(null);
    setCart([]);
    setWishlist([]);

    async function loadUserState() {
      const guestCart = userId ? readStorage(GUEST_CART_KEY) : [];
      const guestWishlist = userId ? readStorage(GUEST_WISHLIST_KEY) : [];
      let nextCart = readStorage(cartKey);
      let nextWishlist = readStorage(wishlistKey);

      if (userId && supabase) {
        const { data: remoteCart } = await supabase
          .from('cart_items')
          .select('quantity, product:products(*)')
          .eq('user_id', userId);
        if (remoteCart?.length) {
          nextCart = remoteCart.map((item) => ({ ...item.product, quantity: item.quantity || 1 }));
        }
      }

      if (userId && guestCart.length) {
        nextCart = mergeProducts(nextCart, guestCart);
        localStorage.removeItem(GUEST_CART_KEY);
      }
      if (userId && guestWishlist.length) {
        nextWishlist = mergeProducts(nextWishlist, guestWishlist, true);
        localStorage.removeItem(GUEST_WISHLIST_KEY);
      }
      if (active) {
        setCart(nextCart);
        setWishlist(nextWishlist);
        setLoadedKey(`${cartKey}|${wishlistKey}`);
      }
    }

    loadUserState();
    return () => { active = false; };
  }, [userId]);

  useEffect(() => {
    if (loadedKey) localStorage.setItem(storageKey('saibaba_cart', userId, GUEST_CART_KEY), JSON.stringify(cart));
  }, [cart, loadedKey, userId]);

  useEffect(() => {
    if (loadedKey) localStorage.setItem(storageKey('saibaba_wishlist', userId, GUEST_WISHLIST_KEY), JSON.stringify(wishlist));
  }, [wishlist, loadedKey, userId]);

  const syncCartItem = async (product, quantity) => {
    if (!userId || !supabase) return;
    if (quantity <= 0) await supabase.from('cart_items').delete().eq('user_id', userId).eq('product_id', getProductId(product));
    else await supabase.from('cart_items').upsert({ user_id: userId, product_id: getProductId(product), quantity }, { onConflict: 'user_id,product_id' });
  };

  const addToCart = (product) => {
    const id = getProductId(product);
    if (id == null) return;
    setCart((current) => {
      const existing = current.find((item) => getProductId(item) === id);
      const quantity = (existing?.quantity || 0) + 1;
      void syncCartItem(product, quantity);
      return existing
        ? current.map((item) => getProductId(item) === id ? { ...item, quantity } : item)
        : [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => getProductId(item) !== productId));
    void syncCartItem({ id: productId }, 0);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    void syncCartItem({ id: productId }, quantity);
    setCart((current) => current.map((item) => getProductId(item) === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    if (userId && supabase) void supabase.from('cart_items').delete().eq('user_id', userId);
  };

  const toggleWishlist = (product) => {
    const id = getProductId(product);
    if (id == null) return;
    const exists = wishlist.some((item) => getProductId(item) === id);
    setWishlist((current) => exists ? current.filter((item) => getProductId(item) !== id) : [...current, product]);
    if (userId && supabase) {
      const request = exists
        ? supabase.from('wishlist_items').delete().eq('user_id', userId).eq('product_id', id)
        : supabase.from('wishlist_items').upsert({ user_id: userId, product_id: id }, { onConflict: 'user_id,product_id' });
      void request;
    }
  };

  const value = {
    cart,
    wishlist,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    cartCount: cart.reduce((total, item) => total + (item.quantity || 1), 0),
    cartTotal: cart.reduce((total, item) => total + Number(item.price || 0) * (item.quantity || 1), 0),
    wishlistCount: wishlist.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
