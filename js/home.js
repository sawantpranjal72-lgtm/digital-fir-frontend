// ==================================
// Digital FIR System - Home Page JS
// Author: Digital FIR Team
// Purpose: UI Enhancements for Home
// ==================================

// Run after page fully loads
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Digital FIR Home Page Loaded");

    highlightActiveMenu();
    enableSmoothScroll();
    handleStickyNavbar();
});

// ==================================
// Highlight active navbar menu
// ==================================
function highlightActiveMenu() {
    const navLinks = document.querySelectorAll(".navbar a");
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active-menu");
        }
    });
}

// ==================================
// Smooth scrolling for anchor links
// ==================================
function enableSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            const target = document.querySelector(link.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

// ==================================
// Sticky navbar shadow on scroll
// ==================================
function handleStickyNavbar() {
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("navbar-shadow");
        } else {
            navbar.classList.remove("navbar-shadow");
        }
    });
}

// ==================================
// Future Enhancements (Do NOT code here)
// ==================================
// ✔ Language toggle → common.js
// ✔ FIR Status fetch → dashboard.js
// ✔ Notifications → app.js
// ✔ Authentication → backend

