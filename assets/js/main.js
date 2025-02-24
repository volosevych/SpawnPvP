document.addEventListener("DOMContentLoaded", function () {
  /* ================================
  ✅ Mobile Menu Toggle
  =================================== */
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function (event) {
      event.stopPropagation();
      menu.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (
        menu.classList.contains("active") &&
        !menu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        menu.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  }

  /* ================================
  ✅ Fade-In Animation (Fixed)
  =================================== */
  const sections = document.querySelectorAll(".fade-in-section");

  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // Stop observing after animation triggers
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ================================
  ✅ Cart Functionality (With Overlay)
  =================================== */
  const cartButton = document.getElementById("cart-button");
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCart = document.getElementById("close-cart");
  const cartOverlay = document.createElement("div");
  cartOverlay.className = "cart-overlay";

  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotal = document.getElementById("cart-total");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  /* ✅ Toggle Cart Visibility & Overlay */
  function hideCart() {
    cartSidebar.classList.remove("show");
    if (document.body.contains(cartOverlay)) {
      document.body.removeChild(cartOverlay);
    }
  }

  if (cartButton && cartSidebar) {
    cartButton.addEventListener("click", (event) => {
      event.stopPropagation();
      cartSidebar.classList.toggle("show");

      if (cartSidebar.classList.contains("show")) {
        document.body.appendChild(cartOverlay);
      } else {
        hideCart();
      }
    });

    closeCart?.addEventListener("click", hideCart);
    cartOverlay.addEventListener("click", hideCart);
  }

  /* ================================
  ✅ Add Item to Cart
  =================================== */
  function addToCart(name, price, image) {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    showAlert(`✅ ${name} added to cart!`, "success", 2500);
  }

  document.querySelectorAll(".cart-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));
      const image = button.getAttribute("data-image");

      if (name && price && image) {
        addToCart(name, price, image);
      }
    });
  });

  /* ================================
  ✅ Update Cart UI
  =================================== */
  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <p>${item.name}</p>
          <p>$${item.price} x ${item.quantity}</p>
        </div>
        <button class="remove-item" data-index="${index}">✖</button>
      `;

      cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        showAlert(`❌ Removed ${cart[index].name} from cart`, "error", 2500);
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      });
    });
  }

  updateCart(); // Load cart items on page load

  /* ================================
  ✅ Discount Code & Terms Handling
  =================================== */
  const discountInput = document.getElementById("discount-code");
  const applyDiscountBtn = document.getElementById("apply-discount");
  const termsCheckbox = document.getElementById("terms-checkbox");
  const checkoutButton = document.querySelector(".checkout-btn");
  const usernameInput = document.getElementById("username-input");

  function showAlert(message, type, duration = 3000) {
    let alertBox = document.getElementById("cart-alert");

    if (!alertBox) {
      alertBox = document.createElement("div");
      alertBox.id = "cart-alert";
      alertBox.classList.add("cart-alert");
      document.body.appendChild(alertBox);
    }

    alertBox.innerHTML = `<p>${message}</p>`;
    alertBox.classList.remove("hide-alert", "success", "error", "warning");
    alertBox.classList.add("show-alert", type);

    setTimeout(() => {
      alertBox.classList.remove("show-alert");
      alertBox.classList.add("hide-alert");
    }, duration);
  }

  applyDiscountBtn?.addEventListener("click", () => {
    const discountCode = discountInput.value.trim();
    if (discountCode === "SAVE10") {
      showAlert("🎉 Discount applied! 10% off.", "success", 4000);
    } else {
      showAlert("❌ Invalid discount code!", "error", 2000);
    }
  });

  termsCheckbox?.addEventListener("change", validateCheckoutButton);

  function validateCheckoutButton() {
    const username = usernameInput?.value.trim();
    checkoutButton.disabled = !termsCheckbox.checked || !username;
  }

  checkoutButton?.addEventListener("click", (e) => {
    const username = usernameInput?.value.trim();

    if (!username) {
      showAlert(
        "⚠️ Please enter your username before checkout.",
        "warning",
        4000
      );
      e.preventDefault();
      return;
    }

    if (!termsCheckbox.checked) {
      showAlert(
        "⚠️ Please accept the terms & conditions before checkout.",
        "warning",
        5000
      );
      e.preventDefault();
      return;
    }

    showAlert("🛒 Redirecting to checkout...", "success", 2000);
    setTimeout(() => {
      window.location.href = "checkout.html";
    }, 2000);
  });

  usernameInput?.addEventListener("input", validateCheckoutButton);
});
