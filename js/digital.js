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