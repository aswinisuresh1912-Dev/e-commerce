import { useEffect, useState } from "react";
import Cart from "./Cart";
import Checkout from "./Checkout";
import "./App.css";

import laptopImage from "./assets/laptop.png";
import mobileImage from "./assets/mobile.jpg";
import earbudsImage from "./assets/earbuds.jpg";
import speakersImage from "./assets/speakers.jpg";
import smartwatchImage from "./assets/smartwatch.jpg";
import MouseImage from "./assets/mouse.jpg";
import TvImage from "./assets/tv.jpg";
import AirConditionerImage from"./assets/ac.png";


const productImages = {
  Laptop: laptopImage,
  Mobile: mobileImage,
  Earbuds: earbudsImage,
  Speakers: speakersImage,
  Smartwatches: smartwatchImage,
  Mouse: MouseImage,
  TV: TvImage,
  AirConditioner: AirConditionerImage
};


function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log("Error loading products:", error);
      });
  }, []);


  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      );

      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ]);
    }
  };


  const updateQuantity = (productId, change) => {
    const updatedCart = cart.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: Math.max(
              1,
              item.quantity + change
            )
          }
        : item
    );

    setCart(updatedCart);
  };


  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(
      (item) => item.id !== productId
    );

    setCart(updatedCart);
  };


  return (
    <div className="app">

      <header className="header">
        <h1>CartiFY</h1>
        <p>Your cart. Your choice.</p>
         <nav>
          <a href="#products">Products</a>
          <a href="#cart">Cart ({cart.length})</a>
        </nav>
      </header>


      <main className="container">

        <h2>Products</h2>

        <div className="product-grid">

          {products.map((product) => (

            <div
              className="product-card"
              key={product.id}
            >

              <div className="image-container">

                <img
                  src={productImages[product.name]}
                  alt={product.name}
                />

              </div>


              <div className="product-info">

                <h3>{product.name}</h3>

                <p className="category">
                  {product.category}
                </p>

                <p className="price">
                  ₹{product.price}
                </p>

                <button
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>

              </div>

            </div>

          ))}

        </div>


        <Cart
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />


        {cart.length > 0 && (

          <button
            className="checkout-button"
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout
          </button>

        )}


        {showCheckout && (

          <Checkout cart={cart} />

        )}

      </main>

    </div>
  );
}

export default App;