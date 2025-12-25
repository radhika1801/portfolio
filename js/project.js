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
      window.location.href = './index.html';
    });
  }
  
  // Smooth scroll animations
  gsap.from('.project-hero', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.2
  });
  
  gsap.from('.project-description', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.4
  });
  
  gsap.from('.project-image', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: '.project-images',
      start: 'top 80%',
    }
  });