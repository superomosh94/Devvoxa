// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  mobileMenuBtn.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    if (this.getAttribute("href") === "#") return;

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: "smooth",
      });

      // Close mobile menu if open
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenuBtn.textContent = "☰";
      }
    }
  });
});

// Header Scroll Effect
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Scroll Animation
const animateOnScroll = () => {
  const elements = document.querySelectorAll(".hidden");

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;

    if (elementPosition < screenPosition) {
      element.classList.add("visible");

      // Add specific animation classes based on element
      if (
        element.classList.contains("service-card") ||
        element.classList.contains("pricing-card") ||
        element.classList.contains("portfolio-item")
      ) {
        element.classList.add("animate");
      } else if (
        element.classList.contains("about-text") ||
        element.classList.contains("contact-info")
      ) {
        element.classList.add("animate-left");
      } else if (
        element.classList.contains("about-image") ||
        element.classList.contains("contact-form")
      ) {
        element.classList.add("animate-right");
      }
    }
  });
};

// Initialize elements as hidden
document
  .querySelectorAll(
    ".service-card, .pricing-card, .portfolio-item, .about-text, .about-image, .contact-info, .contact-form"
  )
  .forEach((el) => {
    el.classList.add("hidden");
  });

// Run on load and scroll
window.addEventListener("load", animateOnScroll);
window.addEventListener("scroll", animateOnScroll);

// Testimonial Slider
const slides = document.querySelectorAll(".testimonial-slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
  currentSlide = index;
}

function nextSlide() {
  let newIndex = (currentSlide + 1) % slides.length;
  showSlide(newIndex);
}

function prevSlide() {
  let newIndex = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(newIndex);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Auto-advance slides every 5 seconds
setInterval(nextSlide, 5000);

// Portfolio Filter
const filterBtns = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    // Filter items
    portfolioItems.forEach((item) => {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// Currency Conversion
const currencySelect = document.getElementById("currency");
const starterPrice = document.getElementById("starterPrice");
const growthPrice = document.getElementById("growthPrice");
const fullPrice = document.getElementById("fullPrice");
const rateInfo = document.getElementById("rateInfo");
const rateDate = document.getElementById("rateDate");

// Base prices in USD
const prices = {
  starter: 300,
  growth: 600,
  full: 1000,
};

// Exchange rates (will be updated from API)
let exchangeRates = {
  USD: 1,
  KES: 140,
  EUR: 0.85,
  NGN: 410,
  INR: 75,
};

// Format currency based on locale
function formatCurrency(amount, currency) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // For currencies not supported by Intl (like KES, NGN)
  if (currency === "KES") return `KES ${amount.toLocaleString()}`;
  if (currency === "NGN") return `₦${amount.toLocaleString()}`;
  if (currency === "INR") return `₹${amount.toLocaleString()}`;

  return formatter.format(amount);
}

// Update prices based on selected currency
function updatePrices() {
  const currency = currencySelect.value;
  const rate = exchangeRates[currency];

  starterPrice.textContent = formatCurrency(prices.starter * rate, currency);
  growthPrice.textContent = formatCurrency(prices.growth * rate, currency);
  fullPrice.textContent = formatCurrency(prices.full * rate, currency);

  // Save currency preference
  localStorage.setItem("preferredCurrency", currency);
}

// Fetch exchange rates from API (using ExchangeRate-API)
async function fetchExchangeRates() {
  try {
    // In a real implementation, you would use the actual API endpoint
    // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    // const data = await response.json();
    // exchangeRates = data.rates;

    // For demo purposes, we'll use hardcoded rates and simulate API call
    console.log("Fetching exchange rates...");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the displayed date
    const now = new Date();
    rateDate.textContent = now.toLocaleString();

    // Update prices
    updatePrices();
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    rateInfo.textContent = "Using default exchange rates";
  }
}

// Initialize currency
function initCurrency() {
  // Load preferred currency from localStorage or browser locale
  const preferredCurrency =
    localStorage.getItem("preferredCurrency") ||
    (navigator.language.includes("KE") ? "KES" : "USD");

  // Set the select value
  if (currencySelect.querySelector(`option[value="${preferredCurrency}"]`)) {
    currencySelect.value = preferredCurrency;
  }

  // Fetch rates and update prices
  fetchExchangeRates();
}

// Event listener for currency change
currencySelect.addEventListener("change", updatePrices);

// Contact Form Submission
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // In a real implementation, you would send this data to your server
  console.log("Form submitted:", { name, email, message });

  // Show success message
  alert(`Thanks, ${name}! We've received your message and will respond soon.`);

  // Reset form
  contactForm.reset();
});

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  initCurrency();

  // Trigger hero animation
  setTimeout(() => {
    document.querySelector(".hero-content").classList.add("animate");
  }, 300);
});
