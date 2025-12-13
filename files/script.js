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
// Currency Conversion
const currencySelect = document.getElementById("currency");
const starterPrice = document.getElementById("starterPrice");
const growthPrice = document.getElementById("growthPrice");
const fullPrice = document.getElementById("fullPrice");
const rateInfo = document.getElementById("rateInfo");
const rateDate = document.getElementById("rateDate");

// Base prices in USD (used for calculation)
const prices = {
  starter: 300,
  growth: 600,
  full: 1000,
};

// Default rates (fallback)
let exchangeRates = {
  USD: 1,
  KES: 140, // Fallback
  EUR: 0.85,
  NGN: 410,
  INR: 75,
};

// Format currency based on locale
function formatCurrency(amount, currency) {
  // Round to nearest integer for clean look
  amount = Math.round(amount);

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
}

// Update prices based on selected currency
function updatePrices() {
  const currency = currencySelect.value;
  // Get rate relative to USD
  const rate = exchangeRates[currency];

  if (rate) {
    starterPrice.textContent = formatCurrency(prices.starter * rate, currency);
    growthPrice.textContent = formatCurrency(prices.growth * rate, currency);
    fullPrice.textContent = formatCurrency(prices.full * rate, currency);
  }
}

// Fetch exchange rates from free API (open.er-api.com)
async function fetchExchangeRates() {
  try {
    rateInfo.textContent = "Updating rates...";

    // Using Open Exchange Rates API (Free, No Key)
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();

    if (data && data.rates) {
      exchangeRates = data.rates;

      // Update the displayed date
      const date = new Date(data.time_last_update_utc);
      rateDate.textContent = date.toLocaleDateString();

      // Force update prices
      updatePrices();
      rateInfo.innerHTML = `Live rates from <a href="https://open.er-api.com" target="_blank" rel="noopener noreferrer">open.er-api.com</a>`;
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    rateInfo.textContent = "Using estimated rates (Offline)";
  }
}

// Initialize currency
function initCurrency() {
  // Default to KES as requested
  const defaultCurrency = "KES";

  // Check if we have a saved preference, otherwise use default
  const preferredCurrency = localStorage.getItem("preferredCurrency") || defaultCurrency;

  // Set the select value if it exists
  if (currencySelect.querySelector(`option[value="${preferredCurrency}"]`)) {
    currencySelect.value = preferredCurrency;
  }

  // Fetch rates and update prices
  fetchExchangeRates();
}

// Event listener for currency change
currencySelect.addEventListener("change", () => {
  updatePrices();
  localStorage.setItem("preferredCurrency", currencySelect.value);
});

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

  // Auto-update footer year
  document.getElementById("currentYear").textContent = new Date().getFullYear();
});

// Portfolio Modal Logic
const modalOverlay = document.getElementById("portfolioModal");
const modalCloseBtn = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalStack = document.getElementById("modalStack");
const modalCta = document.getElementById("modalCta");

// Function to open modal
function openModal(data) {
  modalImage.src = data.image;
  modalCategory.textContent = data.category;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;
  modalStack.textContent = data.stack;

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

// Function to close modal
function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "auto"; // Restore scrolling
}

// Add click listeners to portfolio items
document.querySelectorAll(".portfolio-item").forEach((item) => {
  item.addEventListener("click", () => {
    const data = {
      image: item.getAttribute("data-image"),
      category: item.getAttribute("data-category"),
      title: item.getAttribute("data-title"),
      desc: item.getAttribute("data-desc"),
      stack: item.getAttribute("data-stack"),
    };
    openModal(data);
  });
});

// Close modal event listeners
modalCloseBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
    closeModal();
  }
});

// Modal CTA button - smooth scroll to contact
modalCta.addEventListener("click", () => {
  closeModal();
  const contactSection = document.getElementById("contact");
  contactSection.scrollIntoView({ behavior: "smooth" });
});

