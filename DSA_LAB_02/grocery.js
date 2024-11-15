const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "grocery_list.json");

const data = fs.readFileSync(filePath, "utf-8");
const products = JSON.parse(data).items;
const prices = {
  Milk: 2.5,
  Eggs: 3.0,
  Bread: 2.0,
  Apples: 3.5,
  Bananas: 1.2,
  Tomatoes: 1.0,
  Onions: 0.5,
  Potatoes: 1.0,
  Carrots: 0.8,
  Lettuce: 1.5,
  Cucumber: 0.7,
  Yogurt: 1.2,
  Cheese: 4.0,
  Coffee: 5.0,
  Tea: 3.0,
  Pasta: 1.3,
  Rice: 2.0,
};

const newProduct = products.map((product) => {
  return { ...product, price: product.quantity * prices[product.name] };
});

const totalPrice = newProduct.reduce(
  (total, product) => total + product.price,
  0
);
const display = newProduct.map(
  (product) =>
    `${product.name} - ${product.quantity} ${product.unit} - ${product.price}`
);
const finalDisplay = `Grocery List: 
--------------------
${display.join("\n")} 
--------------------
Total: ${totalPrice.toLocaleString()}
`;
fs.writeFile("shopping_receipt.txt", finalDisplay, "utf8", (err) => {
  if (err) console.log("err writing file");
});
console.log("Receipt generated successfully");
