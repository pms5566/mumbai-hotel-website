/**
 * Mumbai Heritage Inn - Script File
 * Core interactions, animations, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sticky Header scroll effect
  const header = document.getElementById('navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  // Run once on load to initialize correct state
  handleScroll();


  // 2. Mobile Menu (Hamburger Toggle)
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scrolling when menu is open on mobile
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  hamburger.addEventListener('click', toggleMenu);
  
  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  // 3. Date Input Logic (Check-in/Check-out Validation)
  const checkinInput = document.getElementById('form-checkin');
  const checkoutInput = document.getElementById('form-checkout');
  
  if (checkinInput && checkoutInput) {
    // Get today's date formatted as YYYY-MM-DD in local time
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;
    
    // Set checkin minimum date to today
    checkinInput.min = todayFormatted;
    
    checkinInput.addEventListener('change', () => {
      // When checkin date is changed, update checkout min date
      const selectedCheckinDate = new Date(checkinInput.value);
      if (!isNaN(selectedCheckinDate.getTime())) {
        const minCheckout = new Date(selectedCheckinDate);
        minCheckout.setDate(minCheckout.getDate() + 1);
        
        const cYear = minCheckout.getFullYear();
        const cMonth = String(minCheckout.getMonth() + 1).padStart(2, '0');
        const cDay = String(minCheckout.getDate()).padStart(2, '0');
        
        checkoutInput.min = `${cYear}-${cMonth}-${cDay}`;
        
        // If checkout value is less than new min, clear it
        if (checkoutInput.value && new Date(checkoutInput.value) <= selectedCheckinDate) {
          checkoutInput.value = `${cYear}-${cMonth}-${cDay}`;
        }
      }
    });
  }


  // 4. Scroll Reveal Animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once animated, stop observing this element
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // viewport
      threshold: 0.1, // trigger when 10% visible
      rootMargin: '0px 0px -50px 0px' // adjust trigger slightly before entry
    });
    
    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }


  // 5. WhatsApp Form Submission
  const enquiryForm = document.getElementById('whatsappEnquiryForm');
  
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const checkin = document.getElementById('form-checkin').value;
      const checkout = document.getElementById('form-checkout').value;
      const roomType = document.getElementById('form-room').value;
      const roomCount = document.getElementById('form-count').value;
      const message = document.getElementById('form-message').value.trim();
      
      // Target Hotel Phone Number (WhatsApp Enabled)
      const hotelNumber = '919876543210';
      
      // Format dates for message readability (YYYY-MM-DD to DD/MM/YYYY)
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      };
      
      const formattedCheckin = formatDate(checkin);
      const formattedCheckout = formatDate(checkout);
      
      // Construct structured message template
      let text = `*Mumbai Heritage Inn - Booking Enquiry*\n\n`;
      text += `• *Name:* ${name}\n`;
      text += `• *Phone:* ${phone}\n`;
      text += `• *Check-in:* ${formattedCheckin}\n`;
      text += `• *Check-out:* ${formattedCheckout}\n`;
      text += `• *Room Type:* ${roomType}\n`;
      text += `• *No. of Rooms:* ${roomCount}\n`;
      
      if (message) {
        text += `• *Special Request:* ${message}\n`;
      }
      
      // Encode URI
      const encodedText = encodeURIComponent(text);
      
      // WhatsApp Send URL
      const whatsappUrl = `https://wa.me/${hotelNumber}?text=${encodedText}`;
      
      // Open WhatsApp window / app
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

});
