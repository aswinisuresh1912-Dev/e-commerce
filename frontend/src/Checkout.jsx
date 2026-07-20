import { useState } from "react";


function Checkout({ cart }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [order, setOrder] = useState(null);


  const placeOrder = async () => {

    if (!name.trim() || !address.trim()) {
      alert("Please enter your name and address");
      return;
    }


    const orderData = {
      name: name,
      address: address,
      items: cart
    };


    try {

      const response = await fetch(
        "http://127.0.0.1:5000/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(orderData)
        }
      );


      const data = await response.json();


      if (!response.ok) {
        alert(data.error);
        return;
      }


      setOrder(data);

    } catch (error) {

      console.log(
        "Error placing order:",
        error
      );

    }
  };


  return (
    <section className="checkout">

      <h2>Checkout</h2>


      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
      />


      <textarea
        placeholder="Enter your address"
        value={address}
        onChange={(event) =>
          setAddress(event.target.value)
        }
      />


      <button onClick={placeOrder}>
        Place Order
      </button>


      {order && (

        <div className="success-message">

          <h3>
            Order placed successfully!
          </h3>

          <p>
            Order ID: {order.order_id}
          </p>

          <p>
            Total: ₹{order.total_price}
          </p>

        </div>

      )}

    </section>
  );
}

export default Checkout;