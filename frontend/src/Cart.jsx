function Cart({
  cart,
  updateQuantity,
  removeFromCart
}) {
  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );


  return (
    <section className="cart">

      <h2>
        Shopping Cart ({cart.length} items)
      </h2>


      {cart.length === 0 ? (

        <p>Your cart is empty.</p>

      ) : (

        cart.map((item) => (

          <div
            className="cart-item"
            key={item.id}
          >

            <div>
              <h3>{item.name}</h3>

              <p>
                ₹{item.price}
              </p>
            </div>


            <div className="quantity-controls">

              <button
                onClick={() =>
                  updateQuantity(item.id, -1)
                }
              >
                -
              </button>


              <span>
                {item.quantity}
              </span>


              <button
                onClick={() =>
                  updateQuantity(item.id, 1)
                }
              >
                +
              </button>

            </div>


            <button
              className="remove-button"
              onClick={() =>
                removeFromCart(item.id)
              }
            >
              Remove
            </button>

          </div>

        ))

      )}


      {cart.length > 0 && (

        <h2 className="total">
          Total Price: ₹{totalPrice}
        </h2>

      )}

    </section>
  );
}

export default Cart;