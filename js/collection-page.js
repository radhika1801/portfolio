// collection-page.js - Gallery functionality

const photoCollections = {
    fairbanks: { 
      path: "./assets/photography/fairbanks", 
      count: 14,
      prefix: "fb"
    },
    hongkong: { 
      path: "./assets/photography/hongkong", 
      count: 18,
      prefix: "hk"
    },
    jaipur: { 
      path: "./assets/photography/jaipur", 
      count: 16,
      prefix: "j"
    },
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");
    const heroImg = document.getElementById("hero-img");
    const thumbsContainer = document.getElementById("thumbs");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const leftArrow = document.querySelector(".arrow.left");
    const rightArrow = document.querySelector(".arrow.right");
  
    let currentIndex = 0;
    let images = [];
  
    if (gallery) {
      const collection = gallery.dataset.collection;
      const collectionData = photoCollections[collection];
      
      if (!collectionData) {
        console.error('Collection not found:', collection);
        return;
      }
  
      // Generate image array
      images = Array.from({ length: collectionData.count }, (_, i) => {
        return `${collectionData.path}/${collectionData.prefix}${i + 1}.jpg`;
      });
  
      // Create thumbnails
      images.forEach((src, index) => {
        const thumbDiv = document.createElement("div");
        thumbDiv.className = "thumb";
  
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${collection} ${index + 1}`;
        img.loading = index > 8 ? 'lazy' : 'eager';
  
        img.onerror = () => {
          console.error(`Failed to load image: ${src}`);
        };
  
        thumbDiv.appendChild(img);
        thumbsContainer.appendChild(thumbDiv);
  
        // Click handler
        thumbDiv.addEventListener("click", () => {
          currentIndex = index;
          heroImg.src = images[currentIndex];
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      });
  
      // Hero image click - open lightbox
      if (heroImg) {
        heroImg.addEventListener("click", () => {
          lightbox.classList.add("active");
          lightboxImg.src = images[currentIndex];
        });
      }
  
      // Navigation functions
      function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        heroImg.src = images[currentIndex];
        lightboxImg.src = images[currentIndex];
      }
  
      function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        heroImg.src = images[currentIndex];
        lightboxImg.src = images[currentIndex];
      }
  
      // Arrow button handlers
      if (leftArrow) leftArrow.addEventListener("click", prevImage);
      if (rightArrow) rightArrow.addEventListener("click", nextImage);
  
      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") lightbox.classList.remove("active");
      });
  
      // Close lightbox on background click
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove("active");
        }
      });
  
    } else {
      console.log("No gallery found on this page");
    }
  });