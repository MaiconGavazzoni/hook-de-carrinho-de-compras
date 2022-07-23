import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const newSumAmount = { ...sumAmount };
    newSumAmount[product.id] = product.amount;
    return newSumAmount;
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      // TODO
      const response = await api.get('products');
      const products = response.data;

      const productsFormated = products.map((product: Product) => {
        return {
          id: product.id,
          title: product.title,
          priceFormatted: formatPrice(product.price),
          image: product.image
        } as ProductFormatted;
      })
      setProducts(productsFormated);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    // TODO
    addProduct(id);
  }

  return (
    <ProductList >
      {products.length > 0 ?

        products.map((product) => {
          return (
            <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <strong>{product.title}</strong>
              <span>{product.priceFormatted}</span>
              <button
                type="button"
                data-testid="add-product-button"
                onClick={() => handleAddProduct(product.id)}
              >
                <div data-testid="cart-product-quantity">
                  <MdAddShoppingCart size={16} color="#FFF" />
                  {cartItemsAmount[product.id] || 0}
                </div>

                <span>ADICIONAR AO CARRINHO</span>
              </button>
            </li>
          )
        }) :
        <></>
      }
    </ProductList >

    // <ProductList>
    //   <li>
    //     <img src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg" alt="Tênis de Caminhada Leve Confortável" />
    //     <strong>Tênis de Caminhada Leve Confortável</strong>
    //     <span>R$ 179,90</span>
    //     <button
    //       type="button"
    //       data-testid="add-product-button"
    //     // onClick={() => handleAddProduct(product.id)}
    //     >
    //       <div data-testid="cart-product-quantity">
    //         <MdAddShoppingCart size={16} color="#FFF" />
    //         {/* {cartItemsAmount[product.id] || 0} */} 2
    //       </div>

    //       <span>ADICIONAR AO CARRINHO</span>
    //     </button>
    //   </li>
    // </ProductList>



  );
};

export default Home;
