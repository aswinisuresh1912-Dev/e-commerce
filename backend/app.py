from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ecommerce.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(300), nullable=False)
    total_price = db.Column(db.Float, nullable=False)


@app.route("/")
def home():
    return "E-commerce backend is running"


@app.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()

    result = []

    for product in products:
        result.append({
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "category": product.category
        })

    return jsonify(result)


@app.route("/products", methods=["POST"])
def add_product():
    data = request.get_json()

    if not data.get("name") or not data.get("price"):
        return jsonify({
            "error": "Name and price are required"
        }), 400

    product = Product(
        name=data["name"],
        price=data["price"],
        category=data.get("category", "General")
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "category": product.category
    }), 201


@app.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = db.session.get(Product, product_id)

    if product is None:
        return jsonify({
            "error": "Product not found"
        }), 404

    return jsonify({
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "category": product.category
    })


@app.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    product = db.session.get(Product, product_id)

    if product is None:
        return jsonify({
            "error": "Product not found"
        }), 404

    data = request.get_json()

    product.name = data.get("name", product.name)
    product.price = data.get("price", product.price)
    product.category = data.get("category", product.category)

    db.session.commit()

    return jsonify({
        "message": "Product updated successfully"
    })


@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = db.session.get(Product, product_id)

    if product is None:
        return jsonify({
            "error": "Product not found"
        }), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({
        "message": "Product deleted successfully"
    })


@app.route("/orders", methods=["POST"])
def create_order():
    data = request.get_json()

    name = data.get("name")
    address = data.get("address")
    items = data.get("items", [])

    if not name or not address or not items:
        return jsonify({
            "error": "Name, address and items are required"
        }), 400

    total_price = 0

    for item in items:
        total_price += item["price"] * item["quantity"]

    order = Order(
        customer_name=name,
        address=address,
        total_price=total_price
    )

    db.session.add(order)
    db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_price": total_price
    }), 201


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)