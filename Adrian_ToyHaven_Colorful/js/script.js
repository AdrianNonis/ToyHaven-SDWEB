// ============================================================
// TOY HAVEN - MAIN JAVASCRIPT
// ============================================================
// Purpose:
// JavaScript gives the website its interactive behaviour.
// This one file is shared by all pages. Each setup function checks
// whether its page exists before running, so the same script can be reused.
//
// Main website features controlled here:
// - localStorage saving/loading
// - Cart count and Add to Cart
// - Wishlist saving and statuses
// - Product cards and product details popup
// - Home page featured product and rotating banner
// - Product search and category filtering
// - Cart quantity, subtotal and total calculations
// - Checkout form validation and order saving
// - Feedback form and FAQ accordion
// - Newsletter saving
// - Mobile hamburger menu
// - PWA service worker registration
// ============================================================


// ------------------------------
// LOCAL STORAGE FUNCTIONS
// ------------------------------

// Get saved information from localStorage.
// Where used: cart, wishlist, checkout, feedback and order history.
// "name" is the storage key, for example "toyHavenCart".
function getSavedData(name) {
  // getItem() reads the saved text from the browser.
  var data = localStorage.getItem(name);

  // If nothing was saved yet, return an empty array so the website does not crash.
  if (data == null) {
    return [];
  }

  // localStorage stores text. JSON.parse() converts that text back into an array/object.
  return JSON.parse(data);
}


// Save information in localStorage.
// JSON.stringify() changes arrays/objects into text because localStorage stores strings.
function saveData(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}


// Find a product by using its id.
// Where used: cart, checkout, wishlist and product details popup.
// It loops through the products array until the matching id is found.
function findProduct(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      return products[i];
    }
  }
}


// ------------------------------
// CART FUNCTIONS
// ------------------------------

// Update the cart number shown in the navigation bar.
// Website location: "Cart (0)" in the top navigation on every page.
function updateCartCount() {
  var cart = getSavedData("toyHavenCart");
  var count = 0;

  // Add together all saved item quantities.
  for (var i = 0; i < cart.length; i++) {
    count = count + cart[i].quantity;
  }

  var cartCount = document.getElementById("cartCount");

  if (cartCount != null) {
    cartCount.innerText = count;
  }
}


// Add a product to the shopping cart.
// Website location: runs when the user clicks "Add to Cart" on a product card.
function addToCart(id) {
  var cart = getSavedData("toyHavenCart");
  // This Boolean starts as false. It becomes true if the product already exists in the cart.
  var productFound = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      // If already in the cart, increase its quantity instead of adding a duplicate row.
      cart[i].quantity = cart[i].quantity + 1;
      productFound = true;
    }
  }

  if (productFound == false) {
    var newItem = {
      id: id,
      quantity: 1
    };

    // push() adds the new object to the end of the cart array.
    cart.push(newItem);
  }

  // Save the changed cart, refresh the nav counter and tell the user it worked.
  saveData("toyHavenCart", cart);
  updateCartCount();
  alert("Product added to cart");
}


// ------------------------------
// WISHLIST FUNCTIONS
// ------------------------------

// Add a product to the wishlist.
// Website location: runs when the Wishlist button is clicked on a product card.
function addToWishlist(id) {
  var wishlist = getSavedData("toyHavenWishlist");
  var alreadySaved = false;

  for (var i = 0; i < wishlist.length; i++) {
    if (wishlist[i].id == id) {
      alreadySaved = true;
    }
  }

  if (alreadySaved == false) {
    var newItem = {
      id: id,
      // New wishlist products begin with the default status "Interested".
      status: "Interested"
    };

    wishlist.push(newItem);
    saveData("toyHavenWishlist", wishlist);
    alert("Product added to wishlist");
  } else {
    alert("This product is already in your wishlist");
  }
}


// ------------------------------
// PRODUCT CARD
// ------------------------------

// Create one product card.
// This function is reusable, which means the same code creates cards in different places.
// Website location: Home Featured Product and Products page product grid.
function productCard(product) {
  // Start with an empty text string and build the product card HTML piece by piece.
  var html = "";

  html = html + '<div class="product-card">';
  html = html + '<img src="' + product.image + '" alt="' + product.name + '">';
  html = html + '<p class="category">' + product.category + '</p>';
  html = html + '<h3>' + product.name + '</h3>';
  html = html + '<p class="price">$' + product.price.toFixed(2) + '</p>';
  html = html + '<button class="button" onclick="addToCart(' + product.id + ')">Add to Cart</button> ';
  html = html + '<button class="button light" onclick="addToWishlist(' + product.id + ')">Wishlist</button> ';
  html = html + '<button class="details-btn" onclick="showDetails(' + product.id + ')">Details</button>';
  html = html + '</div>';

  // Send the completed HTML text back to the place that called productCard().
  return html;
}


// ------------------------------
// HOME PAGE
// ------------------------------

// Runs Home-page-only JavaScript.
function setupHome() {
  var featuredProduct = document.getElementById("featuredProduct");

  // Stop this function when we are not on the Home page.
  if (featuredProduct == null) {
    return;
  }

  // Choose a product using today's date.
  // The % operator keeps the result inside the available product array positions.
  var today = new Date();
  var day = today.getDate();
  var productNumber = day % products.length;
  var chosenProduct = products[productNumber];

  // Insert the chosen product card into #featuredProduct on index.html.
  featuredProduct.innerHTML = productCard(chosenProduct);

  // Simple rotating banner information.
  // Each smaller array contains: heading, paragraph and image path.
  var slides = [
    [
      "Heroes for Every Collection",
      "Discover figurines that make your shelf stand out.",
      "images/DR doom figurine 2.jpg"
    ],
    [
      "Game Night Starts Here",
      "Bring friends and family together with classic board games.",
      "images/board game 2.jpg"
    ],
    [
      "Ready, Set, Race!",
      "Explore exciting cars and toys made for action and fun.",
      "images/remort control car.jpg"
    ]
  ];

  var slideNumber = 0;

  // setInterval repeats this block every 4000 milliseconds (4 seconds).
  setInterval(function () {
    slideNumber = slideNumber + 1;

    if (slideNumber == slides.length) {
      slideNumber = 0;
    }

    // Get the hero image so we can give the slide a simple fade effect.
    var heroImage = document.getElementById("heroImage");

    // Make the current image fade slightly before changing it.
    heroImage.style.opacity = "0";

    // Wait a short time, then change the text and image.
    // This keeps the code simple while making the banner transition smoother.
    setTimeout(function () {
      document.getElementById("heroTitle").innerText = slides[slideNumber][0];
      document.getElementById("heroText").innerText = slides[slideNumber][1];
      heroImage.src = slides[slideNumber][2];

      // Show the new image again after the source has changed.
      heroImage.style.opacity = "1";
    }, 250);
  }, 4000);
}


// ------------------------------
// PRODUCTS PAGE
// ------------------------------

// Runs Products-page-only JavaScript.
function setupProducts() {
  var productGrid = document.getElementById("productGrid");

  // Stop this function when we are not on the Products page.
  if (productGrid == null) {
    return;
  }

  var searchInput = document.getElementById("searchInput");
  var categorySelect = document.getElementById("categorySelect");

  // This inner function rebuilds the product list whenever search/filter values change.
  function displayProducts() {
    var html = "";
    var productCount = 0;
    // Convert search text to lowercase so searches are not case-sensitive.
    var searchText = searchInput.value.toLowerCase();
    var selectedCategory = categorySelect.value;

    for (var i = 0; i < products.length; i++) {
      var productName = products[i].name.toLowerCase();
      // indexOf() returns -1 when the typed text is not found in the product name.
      var nameMatch = productName.indexOf(searchText) != -1;

      var categoryMatch = false;

      if (selectedCategory == "All") {
        categoryMatch = true;
      }

      if (products[i].category == selectedCategory) {
        categoryMatch = true;
      }

      // A product is shown only when BOTH the name search and category filter match.
      if (nameMatch == true && categoryMatch == true) {
        html = html + productCard(products[i]);
        productCount = productCount + 1;
      }
    }

    // Put all matching product cards into #productGrid on products.html.
    productGrid.innerHTML = html;

    if (productCount == 0) {
      document.getElementById("noProducts").innerText = "No products found.";
    } else {
      document.getElementById("noProducts").innerText = "";
    }
  }

  // Re-run displayProducts while the user types or changes the dropdown.
  searchInput.addEventListener("input", displayProducts);
  categorySelect.addEventListener("change", displayProducts);

  displayProducts();
}


// Show the product details popup.
// Website location: modal on Products page after clicking a Details button.
function showDetails(id) {
  var modal = document.getElementById("productModal");

  if (modal == null) {
    return;
  }

  var product = findProduct(id);
  var html = "";

  html = html + '<img src="' + product.image + '" alt="' + product.name + '">';
  html = html + '<h2>' + product.name + '</h2>';
  html = html + '<p>' + product.description + '</p>';
  html = html + '<p class="price">$' + product.price.toFixed(2) + '</p>';

  document.getElementById("modalContent").innerHTML = html;
  // CSS normally hides the modal. Changing display to flex makes it visible.
  modal.style.display = "flex";
}


// Close the product details popup.
// Website location: X button in the top-right of the Products page modal.
function setupModal() {
  var closeButton = document.getElementById("closeModal");

  if (closeButton == null) {
    return;
  }

  closeButton.addEventListener("click", function () {
    document.getElementById("productModal").style.display = "none";
  });
}


// ------------------------------
// SHOPPING CART PAGE
// ------------------------------

// Runs Shopping-Cart-page-only JavaScript.
function setupCart() {
  var cartItems = document.getElementById("cartItems");

  // Stop this function when we are not on the Cart page.
  if (cartItems == null) {
    return;
  }

  // Reads saved cart data and redraws all cart rows and totals.
  function displayCart() {
    var cart = getSavedData("toyHavenCart");
    var html = "";
    var totalPrice = 0;
    var totalItems = 0;

    for (var i = 0; i < cart.length; i++) {
      var product = findProduct(cart[i].id);
      // Calculate the subtotal for one item: price x quantity.
      var subtotal = product.price * cart[i].quantity;

      // Add this item's subtotal and quantity to the cart totals.
      totalPrice = totalPrice + subtotal;
      totalItems = totalItems + cart[i].quantity;

      html = html + '<div class="cart-item">';
      html = html + '<img src="' + product.image + '" alt="' + product.name + '">';
      html = html + '<div>';
      html = html + '<h3>' + product.name + '</h3>';
      html = html + '<p>$' + product.price.toFixed(2) + ' each</p>';
      html = html + '<button onclick="changeQuantity(' + product.id + ', -1)">-</button>';
      html = html + '<span class="qty">' + cart[i].quantity + '</span>';
      html = html + '<button onclick="changeQuantity(' + product.id + ', 1)">+</button>';
      html = html + '<p>Subtotal: $' + subtotal.toFixed(2) + '</p>';
      html = html + '</div>';
      html = html + '</div>';
    }

    if (cart.length == 0) {
      html = '<p class="message">Your cart is empty.</p>';
    }

    // Display the generated cart rows, item count and final total on cart.html.
    cartItems.innerHTML = html;
    document.getElementById("totalItems").innerText = totalItems;
    document.getElementById("cartTotal").innerText = totalPrice.toFixed(2);

    updateCartCount();
  }


  // Increase or decrease a product quantity.
  // Website location: the - and + buttons beside each cart item.
  window.changeQuantity = function (id, amount) {
    var cart = getSavedData("toyHavenCart");

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id == id) {
        // amount will be -1 for minus or +1 for plus.
        cart[i].quantity = cart[i].quantity + amount;

        if (cart[i].quantity <= 0) {
          // splice(i, 1) removes one item from the array if quantity reaches zero.
          cart.splice(i, 1);
        }

        break;
      }
    }

    saveData("toyHavenCart", cart);
    displayCart();
  };


  // Clear all products from the cart.
  // Website location: "Clear Cart" button inside the Cart Summary box.
  document.getElementById("clearCart").addEventListener("click", function () {
    var answer = confirm("Clear all products from the cart?");

    if (answer == true) {
      // Empty the cart after a successful checkout.
      saveData("toyHavenCart", []);
      displayCart();
    }
  });

  displayCart();
}


// ------------------------------
// CHECKOUT PAGE
// ------------------------------

// Runs Checkout-page-only JavaScript.
function setupCheckout() {
  var checkoutForm = document.getElementById("checkoutForm");

  // Stop this function when we are not on the Checkout page.
  if (checkoutForm == null) {
    return;
  }

  var cart = getSavedData("toyHavenCart");
  var html = "";
  var totalPrice = 0;

  // Show products in the order summary.
  // Website location: right-side Order Summary box on checkout.html.
  for (var i = 0; i < cart.length; i++) {
    var product = findProduct(cart[i].id);
    var subtotal = product.price * cart[i].quantity;

    totalPrice = totalPrice + subtotal;

    html = html + '<p>';
    html = html + product.name + ' x ' + cart[i].quantity;
    html = html + ' = $' + subtotal.toFixed(2);
    html = html + '</p>';
  }

  if (cart.length == 0) {
    html = "<p>Your cart is empty.</p>";
  }

  document.getElementById("checkoutItems").innerHTML = html;
  document.getElementById("checkoutTotal").innerText = totalPrice.toFixed(2);


  // Check the form when the customer submits it.
  checkoutForm.addEventListener("submit", function (event) {
    // Stop the browser from reloading/submitting immediately so JavaScript can validate first.
    event.preventDefault();

    var fullName = document.getElementById("fullName");
    var email = document.getElementById("email");
    var address = document.getElementById("address");
    var payment = document.getElementById("payment");
    // Assume the form is valid first. Any failed check changes this to false.
    var valid = true;

    // Clear old error messages before checking the form again.
    // These messages appear below each field on the Checkout page.
    document.getElementById("nameError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("addressError").innerText = "";
    document.getElementById("paymentError").innerText = "";

    if (fullName.value.trim() == "") {
      document.getElementById("nameError").innerText = "Please enter your full name.";
      valid = false;
    }

    if (email.value.indexOf("@") == -1) {
      document.getElementById("emailError").innerText = "Please enter a valid email.";
      valid = false;
    }

    if (address.value.trim() == "") {
      document.getElementById("addressError").innerText = "Please enter your address.";
      valid = false;
    }

    if (payment.value == "") {
      document.getElementById("paymentError").innerText = "Please choose a payment method.";
      valid = false;
    }

    if (cart.length == 0) {
      alert("Your cart is empty.");
      valid = false;
    }

    // Only save the order when every validation check passed.
    if (valid == true) {
      var orders = getSavedData("toyHavenOrders");

      // Create one order object containing the customer's information and total.
      var order = {
        name: fullName.value,
        email: email.value,
        address: address.value,
        payment: payment.value,
        total: totalPrice,
        date: new Date().toLocaleDateString()
      };

      // Add the new order to order history, then save it in localStorage.
      orders.push(order);

      saveData("toyHavenOrders", orders);
      saveData("toyHavenCart", []);

      document.getElementById("successBox").innerText =
        "Order placed successfully! Thank you for shopping with Toy Haven.";

      checkoutForm.reset();
      updateCartCount();
    }
  });
}


// ------------------------------
// WISHLIST PAGE
// ------------------------------

// Runs Wishlist-page-only JavaScript.
function setupWishlist() {
  var wishlistGrid = document.getElementById("wishlistGrid");

  // Stop this function when we are not on the Wishlist page.
  if (wishlistGrid == null) {
    return;
  }

  var wishlistFilter = document.getElementById("wishlistFilter");

  // Builds wishlist cards according to the selected status filter.
  function displayWishlist() {
    var wishlist = getSavedData("toyHavenWishlist");
    var html = "";
    var visibleProducts = 0;

    for (var i = 0; i < wishlist.length; i++) {
      // Decides whether the current wishlist product should be visible.
      var showProduct = false;

      if (wishlistFilter.value == "All") {
        showProduct = true;
      }

      if (wishlist[i].status == wishlistFilter.value) {
        showProduct = true;
      }

      if (showProduct == true) {
        var product = findProduct(wishlist[i].id);
        visibleProducts = visibleProducts + 1;

        html = html + '<div class="product-card">';
        html = html + '<img src="' + product.image + '" alt="' + product.name + '">';
        html = html + '<h3>' + product.name + '</h3>';
        html = html + '<p>' + product.category + '</p>';
        html = html + '<label>Status</label>';
        html = html + '<select onchange="changeStatus(' + product.id + ', this.value)">';

        if (wishlist[i].status == "Interested") {
          html = html + '<option selected>Interested</option>';
        } else {
          html = html + '<option>Interested</option>';
        }

        if (wishlist[i].status == "Owned") {
          html = html + '<option selected>Owned</option>';
        } else {
          html = html + '<option>Owned</option>';
        }

        if (wishlist[i].status == "Not Interested") {
          html = html + '<option selected>Not Interested</option>';
        } else {
          html = html + '<option>Not Interested</option>';
        }

        html = html + '</select>';
        html = html + '<button class="button light" onclick="removeWishlist(' + product.id + ')">Remove</button>';
        html = html + '</div>';
      }
    }

    wishlistGrid.innerHTML = html;

    if (visibleProducts == 0) {
      document.getElementById("wishlistEmpty").innerText = "No products in this section.";
    } else {
      document.getElementById("wishlistEmpty").innerText = "";
    }
  }


  // Change the saved status of a wishlist item.
  // Website location: status dropdown on each Wishlist product card.
  window.changeStatus = function (id, newStatus) {
    var wishlist = getSavedData("toyHavenWishlist");

    for (var i = 0; i < wishlist.length; i++) {
      if (wishlist[i].id == id) {
        wishlist[i].status = newStatus;
      }
    }

    saveData("toyHavenWishlist", wishlist);
    displayWishlist();
  };


  // Remove an item from the wishlist.
  // Website location: Remove button on each Wishlist product card.
  window.removeWishlist = function (id) {
    var wishlist = getSavedData("toyHavenWishlist");

    for (var i = 0; i < wishlist.length; i++) {
      if (wishlist[i].id == id) {
        wishlist.splice(i, 1);
        break;
      }
    }

    saveData("toyHavenWishlist", wishlist);
    displayWishlist();
  };

  wishlistFilter.addEventListener("change", displayWishlist);
  displayWishlist();
}


// ------------------------------
// SUPPORT PAGE
// ------------------------------

// Runs Support-page-only JavaScript.
function setupSupport() {
  var feedbackForm = document.getElementById("feedbackForm");

  // Stop this function when we are not on the Support page.
  if (feedbackForm == null) {
    return;
  }

  // Runs when the user presses Send Feedback.
  feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("feedbackName");
    var email = document.getElementById("feedbackEmail");
    var message = document.getElementById("feedbackMessage");
    var valid = true;

    document.getElementById("feedbackNameError").innerText = "";
    document.getElementById("feedbackEmailError").innerText = "";
    document.getElementById("feedbackMessageError").innerText = "";

    if (name.value.trim() == "") {
      document.getElementById("feedbackNameError").innerText = "Please enter your name.";
      valid = false;
    }

    if (email.value.indexOf("@") == -1) {
      document.getElementById("feedbackEmailError").innerText = "Please enter a valid email.";
      valid = false;
    }

    if (message.value.trim().length < 5) {
      document.getElementById("feedbackMessageError").innerText = "Please enter a longer message.";
      valid = false;
    }

    if (valid == true) {
      var feedback = getSavedData("toyHavenFeedback");

      // Build a simple object containing the submitted feedback values.
      var newFeedback = {
        name: name.value,
        email: email.value,
        message: message.value
      };

      feedback.push(newFeedback);
      saveData("toyHavenFeedback", feedback);

      document.getElementById("feedbackSuccess").innerText =
        "Thank you! Your feedback has been saved.";

      feedbackForm.reset();
    }
  });


  // FAQ accordion buttons.
  // Website location: Frequently Asked Questions on the Support page.
  var questions = document.getElementsByClassName("faq-question");

  for (var i = 0; i < questions.length; i++) {
    questions[i].addEventListener("click", function () {
      // The answer div is directly after the clicked question button in the HTML.
      var answer = this.nextElementSibling;

      if (answer.style.display == "block") {
        answer.style.display = "none";
      } else {
        answer.style.display = "block";
      }
    });
  }
}


// ------------------------------
// NEWSLETTER
// ------------------------------

// Handles the newsletter form shown in the footer of every page.
function setupNewsletter() {
  var newsletterForm = document.getElementById("newsletterForm");

  if (newsletterForm == null) {
    return;
  }

  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("newsletterEmail").value;

    if (email.indexOf("@") != -1) {
      // Save the valid email directly in localStorage.
      localStorage.setItem("toyHavenNewsletter", email);
      document.getElementById("newsletterMessage").innerText = "Subscribed successfully!";
      newsletterForm.reset();
    } else {
      alert("Please enter a valid email.");
    }
  });
}


// ------------------------------
// MOBILE MENU
// ------------------------------

// Controls the hamburger navigation shown on tablet/mobile screens.
function setupMenu() {
  var menuButton = document.getElementById("menuBtn");
  var navigation = document.getElementById("nav");

  menuButton.addEventListener("click", function () {
    // Add/remove the CSS class "show". CSS decides whether the menu is visible.
    navigation.classList.toggle("show");
  });
}


// ------------------------------
// START THE WEBSITE FUNCTIONS
// ------------------------------

// Run these functions after the HTML has loaded.
// DOMContentLoaded prevents JavaScript from trying to use HTML elements before they exist.
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  setupMenu();
  setupNewsletter();
  setupHome();
  setupProducts();
  setupCart();
  setupCheckout();
  setupWishlist();
  setupSupport();
  setupModal();
});


// Register the service worker for the PWA requirement.
// This only runs if the browser supports service workers.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js");
  });
}
