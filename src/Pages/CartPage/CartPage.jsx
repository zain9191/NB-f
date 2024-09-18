import React, { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import MealCard from "../../components/MealCard/MealCard";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, handleQuantityChange } =
    useContext(CartContext);

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <MealCard meal={item} showAddToCart={false} clickable={false} />
                <div className="cart-item-actions">
                  <label>
                    Quantity:
                    <input
                      type="number"
                      min="1"
                      value={item.quantity || 1}
                      onChange={(e) =>
                        handleQuantityChange(item._id, parseInt(e.target.value))
                      }
                    />
                  </label>
                  <button onClick={() => handleRemove(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button onClick={clearCart}>Clear Cart</button>
          <button>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
