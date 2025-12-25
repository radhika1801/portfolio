// photography-grid.js - Grid-based layout with scale animations
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// All photo collections
const photoCollections = {
  fairbanks: { 
    path: "/assets/photography/fairbanks", 
    count: 14,
    prefix: "fb"
  },
  hongkong: { 
    path: "/assets/photography/hongkong", 
    count: 18,
    prefix: "hk"
  },
  jaipur: { 
    path: "/assets/photography/jaipur", 
    count: 16,
    prefix: "j"
  },
};

// Create FIXED order of images - 28 images total (7 rows x 4 images)
function getAllImages() {
  const order = [
    // Section 1
    { collection: 'fairbanks', num: 1 },
    { collection: 'hongkong', num: 5 },
    { collection: 'jaipur', num: 3 },
    { collection: 'fairbanks', num: 7 },
    // Section 2
    { collection: 'hongkong', num: 2 },
    { collection: 'jaipur', num: 8 },
    { collection: 'fairbanks', num: 4 },
    { collection: 'hongkong', num: 11 },
    // Section 3
    { collection: 'jaipur', num: 1 },
    { collection: 'fairbanks', num: 9 },
    { collection: 'hongkong', num: 7 },
    { collection: 'jaipur', num: 12 },
    // Section 4
    { collection: 'fairbanks', num: 2 },
    { collection: 'hongkong', num: 14 },
    { collection: 'jaipur', num: 5 },
    { collection: 'fairbanks', num: 11 },
    // Section 5
    { collection: 'hongkong', num: 3 },
    { collection: 'jaipur', num: 9 },
    { collection: 'fairbanks', num: 6 },
    { collection: 'hongkong', num: 9 },
    // Section 6
    { collection: 'jaipur', num: 2 },
    { collection: 'fairbanks', num: 13 },
    { collection: 'hongkong', num: 15 },
    { collection: 'jaipur', num: 7 },
    // Section 7
    { collection: 'fairbanks', num: 8 },
    { collection: 'hongkong', num: 1 },
    { collection: 'jaipur', num: 11 },
    { collection: 'fairbanks', num: 14 },
  ];
  
  return order.map(item => {
    const collection = photoCollections[item.collection];
    return {
      src: `${collection.path}/${collection.prefix}${item.num}.jpg`,
      alt: `${item.collection} photo ${item.num}`,
      collection: item.collection
    };
  });
}

// Grid patterns - define which columns have images in each row
// 7 rows for 28 images
const gridPatterns = [
  [0, 2],        // Row 1
  [1, 3],        // Row 2
  [0, 3],        // Row 3
  [1, 2],        // Row 4
  [0, 3],        // Row 5
  [1, 3],        // Row 6
  [0, 2],        // Row 7
];

// Create the photography grid
function createPhotoGrid() {
  const container = document.querySelector(".photography-container");
  if (!container) {
    console.error("Photography container not found");
    return;
  }

  container.innerHTML = "";
  const allImages = getAllImages();
  let imageIndex = 0;

  // Create rows based on patterns
  gridPatterns.forEach((pattern, rowIndex) => {
    if (imageIndex >= allImages.length) return;

    const rowDiv = document.createElement("div");
    rowDiv.className = "row";
    rowDiv.id = `row-${rowIndex}`;
    
    // Add extra top margin to first row only
    if (rowIndex === 0) {
      rowDiv.style.marginTop = "20vh";
    }

    // Create 4 columns
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const colDiv = document.createElement("div");
      colDiv.className = "col";

      // Check if this column should have an image
      if (pattern.includes(colIndex) && imageIndex < allImages.length) {
        const imageData = allImages[imageIndex];
        
        // Create link wrapper
        const link = document.createElement("a");
        link.href = `./photopages/${imageData.collection}.html`;
        link.className = "photo-link";
        
        const imgWrapper = document.createElement("div");
        imgWrapper.className = "img";
        
        // Set origin based on column position
        const origin = colIndex < 2 ? "left" : "right";
        imgWrapper.setAttribute("data-origin", origin);

        const img = document.createElement("img");
        img.src = imageData.src;
        img.alt = imageData.alt;
        img.loading = imageIndex > 4 ? "lazy" : "eager";

        imgWrapper.appendChild(img);
        link.appendChild(imgWrapper);
        colDiv.appendChild(link);
        imageIndex++;
      }

      rowDiv.appendChild(colDiv);
    }

    container.appendChild(rowDiv);
  });
}

// Initialize scroll animations
function initScrollAnimations() {
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Set initial scale
  gsap.set(".img", { scale: 0, force3D: true });

  const rows = document.querySelectorAll(".row");

  rows.forEach((row, index) => {
    const rowImages = row.querySelectorAll(".img");

    if (rowImages.length > 0) {
      // Scale In animation
      ScrollTrigger.create({
        id: `scaleIn-${index}`,
        trigger: row,
        start: "top bottom",
        end: "bottom bottom-=10%",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (self.isActive) {
            const progress = self.progress;
            const easedProgress = Math.min(1, progress * 1.2);
            const scaleValue = gsap.utils.interpolate(0, 1, easedProgress);

            rowImages.forEach((img) => {
              gsap.set(img, {
                scale: scaleValue,
                force3D: true,
              });
            });

            if (progress > 0.95) {
              gsap.set(rowImages, { scale: 1, force3D: true });
            }
          }
        },
        onLeave: function () {
          gsap.set(rowImages, { scale: 1, force3D: true });
        },
      });

      // Scale Out animation
      ScrollTrigger.create({
        id: `scaleOut-${index}`,
        trigger: row,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        scrub: 1,
        invalidateOnRefresh: true,
        onEnter: function () {
          gsap.set(rowImages, { scale: 1, force3D: true });
        },
        onUpdate: function (self) {
          if (self.isActive) {
            const scale = gsap.utils.interpolate(1, 0, self.progress);

            rowImages.forEach((img) => {
              gsap.set(img, {
                scale: scale,
                force3D: true,
                clearProps: self.progress === 1 ? "scale" : "",
              });
            });
          } else {
            const isAbove = self.scroll() < self.start;
            if (isAbove) {
              gsap.set(rowImages, {
                scale: 1,
                force3D: true,
              });
            }
          }
        },
      });

      // Marker trigger for state management
      ScrollTrigger.create({
        id: `marker-${index}`,
        trigger: row,
        start: "bottom bottom",
        end: "top top",
        onEnter: function () {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImages, { scale: 1, force3D: true });
          }
        },
        onLeave: function () {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImages, { scale: 1, force3D: true });
          }
        },
        onEnterBack: function () {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImages, { scale: 1, force3D: true });
          }
        },
      });
    }
  });

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh(true);
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  document.fonts.ready.then(() => {
    createPhotoGrid();
    
    setTimeout(() => {
      initScrollAnimations();
    }, 100);
  });
});

// Update time and date
function updateDateTime() {
    const now = new Date();
  
    const timeOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Tokyo",
    };
    const timeStr = now.toLocaleTimeString("en-US", timeOptions).toUpperCase() + " [TOKYO]";
    document.getElementById("current-time").textContent = timeStr;
  
    const dateOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    const dateStr = now.toLocaleDateString("en-US", dateOptions).toUpperCase();
    document.getElementById("current-date").textContent = dateStr;
  }
  
  updateDateTime();
  setInterval(updateDateTime, 60000);
  
  // Click on name to go home
  const siteName = document.querySelector('.site-name p:first-child');
  if (siteName) {
    siteName.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }
  
  // GSAP Animations
  const workProjects = document.querySelectorAll('.work-project');
  gsap.set(workProjects, { y: 60, opacity: 0 });
  gsap.to(workProjects, {
    y: 0,
    opacity: 1,
    stagger: 0.08,
    delay: 0.3,
    duration: 0.7,
    ease: "power3.out",
  });