// ------------------------------------------------------------
// TOY HAVEN - PRODUCT DATA
// ------------------------------------------------------------
// Purpose:
// This file stores all product information used by the website.
// script.js reads this array to create product cards, cart items,
// wishlist items, checkout summaries and the featured product.
//
// Where it is shown:
// - Home page: Featured Product of the Day
// - Products page: All product cards
// - Cart page: Product name, image and price
// - Checkout page: Product names and totals
// - Wishlist page: Saved product cards
// ------------------------------------------------------------

// "var products" creates an array (a list) that contains product objects.
// Each object below represents one product.
var products = [

  // PRODUCT 1
  // id = unique number used by JavaScript to identify this product.
  // name = product name shown on cards and summaries.
  // category = used by the Products page category filter.
  // price = used for product price, cart subtotal and checkout total.
  // image = path to the product image shown on the website.
  // description = shown inside the product Details popup.
  {
    id: 1,
    name: "Dr Doom Figurine",
    category: "Figurines",
    price: 18.50,
    image: "images/Dr doom figurine 2.jpg",
    description: "Main Character figurines for collectors."
  },

  // PRODUCT 2
  {
    id: 2,
    name: "Gambit Figurine",
    category: "Figurines",
    price: 21.00,
    image: "images/gambit figurine.jpg",
    description: "gambit the butter nuts talker figurine."
  },

  // PRODUCT 3
  {
    id: 3,
    name: "Bayblades",
    category: "Toys",
    price: 25.00,
    image: "images/toy 2.jpg",
    description: "Metal rimmed spinners for old memories."
  },

  // PRODUCT 4
  {
    id: 4,
    name: "spooder-man",
    category: "Toys",
    price: 16.50,
    image: "images/toy 3.jpg",
    description: "The Fake spider man."
  },

  // PRODUCT 5
  {
    id: 5,
    name: "MOD Chess",
    category: "Board Games",
    price: 23.00,
    image: "images/board game 1.jpg",
    description: "A chess set for family game time."
  },

  // PRODUCT 6
  {
    id: 6,
    name: "Monopoly",
    category: "Board Games",
    price: 28.00,
    image: "images/board game 2.jpg",
    description: "An adventure board game for friends and family."
  },

  // PRODUCT 7
  {
    id: 7,
    name: "Off-road Racer",
    category: "Diecast Cars",
    price: 14.00,
    image: "images/remort control car.jpg",
    description: "A sporty diecast racing car for model collectors."
  },

  // PRODUCT 8
  {
    id: 8,
    name: "HotWheels",
    category: "Diecast Cars",
    price: 15.50,
    image: "images/toy 1.jpg",
    description: "A detailed miniature Car made for display and play."
  }
];
