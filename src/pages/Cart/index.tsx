import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}


const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      priceFormatted: formatPrice(product.price),
      image: product.image,
      amount: product.amount,
      total: formatPrice(product.price * product.amount),
    };
  });
  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        // TODO
        return sumTotal + (product.price * product.amount);

      }, 0)
    )

  function handleProductIncrement(product: Product) {
    // TODO
    const update = {
      productId: product.id,
      amount: product.amount + 1
    };

    updateProductAmount(update)
  }

  function handleProductDecrement(product: Product) {
    // TODO
    const update = {
      productId: product.id,
      amount: product.amount - 1
    };

    updateProductAmount(update)
  }

  function handleRemoveProduct(productId: number) {
    // TODO
    removeProduct(productId)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? cart.map(product => {
            return (
              <tr data-testid="product" key={product.id}>
                <td>
                  <img src={product.image} alt={product.title} />
                </td>
                <td>
                  <strong>{product.title}</strong>
                  <span>{cartFormatted.find(productFormatted => productFormatted.id === product.id)?.priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={product.amount <= 1}
                      onClick={() => handleProductDecrement(product)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={product.amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(product)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{cartFormatted.find(productFormatted => productFormatted.id === product.id)?.total}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            )
          })
            :
            <></>

          }


        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
