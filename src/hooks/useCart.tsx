import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    //localStorage.removeItem('@RocketShoes:cart');
    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    console.log(storagedCart);
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO

      const updatedCart = [...cart];
      const existsProduct = updatedCart.find(product => product.id === productId);

      const stockProduct = await api.get(`stock/${productId}`);
      const stockAtual = stockProduct.data as Stock;


      const currentAmount = existsProduct ? existsProduct.amount : 0;
      const newAmount = currentAmount + 1;
      if (newAmount > stockAtual.amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }



      if (existsProduct) {
        existsProduct.amount = newAmount;

        //updateProductAmount(update);

      } else {
        const response = await api.get(`products/${productId}`);
        const product = response.data as Product;

        const newProduct = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          amount: 1
        }
        updatedCart.push(newProduct);
      }

      setCart(updatedCart);
      localStorage.removeItem('@RocketShoes:cart')
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))

    } catch {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const product = cart.find(product => product.id === productId);
      if (!product) {
        toast.error('Erro na remoção do produto')
        return
      }

      const newCart = cart.filter(product => product.id !== productId);
      setCart(newCart);
      localStorage.removeItem('@RocketShoes:cart')
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      if (amount <= 0) {
        toast.error('Erro na adição do produto')
        return;
      }

      const product = cart.find(product => product.id === productId);
      if (!product) {
        toast.error('Erro na alteração de quantidade do produto')
        return;
      }

      const stockProduct = await api.get(`stock/${productId}`);
      const stockAtual = stockProduct.data as Stock;
      if (amount > stockAtual.amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }



      const newCart = cart.filter(product => {
        if (product.id === productId) {
          product.amount = amount;
          return product;
        } else {
          return product;
        }

      });
      setCart(newCart);
      localStorage.removeItem('@RocketShoes:cart')
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))

    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
