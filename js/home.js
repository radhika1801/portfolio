// PIXEL PET - Controllable Photographer Creature
(function() {
  const canvas = document.getElementById('pixel-pet');
  const ctx = canvas.getContext('2d');
  
  // Disable image smoothing for crisp pixels
  ctx.imageSmoothingEnabled = false;
  
  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = 200;
  
  // Keyboard controls
  const keys = {
    left: false,
    right: false
  };
  
  // Pet state
  const pet = {
    x: 100,
    y: canvas.height - 80,
    width: 64,
    height: 64,
    speed: 3,
    direction: 1,
    state: 'idle', // idle, walking
    frameCount: 0,
    animFrame: 0,
    bobOffset: 0
  };
  
  // Keyboard event listeners
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      keys.left = true;
      pet.direction = -1;
      pet.state = 'walking';
    }
    if (e.key === 'ArrowRight') {
      keys.right = true;
      pet.direction = 1;
      pet.state = 'walking';
    }
  });
  
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
      keys.left = false;
    }
    if (e.key === 'ArrowRight') {
      keys.right = false;
    }
    
    // Stop walking if no keys pressed
    if (!keys.left && !keys.right) {
      pet.state = 'idle';
    }
  });
  
  // Draw pixelated pet
  function drawPet() {
    const ps = 6; // Pixel size
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Subtle shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(pet.x + 10, pet.y + pet.height - 5, pet.width - 20, 6);
    
    // Save context
    ctx.save();
    
    // Flip if walking left
    if (pet.direction === -1) {
      ctx.translate(pet.x + pet.width, pet.y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(pet.x, pet.y);
    }
    
    // Draw based on state
    if (pet.state === 'idle') {
      drawIdle(ps);
    } else if (pet.state === 'walking') {
      drawWalking(ps);
    }
    
    ctx.restore();
  }
  
  function drawIdle(ps) {
    // Body
    ctx.fillStyle = '#ff69b4';
    ctx.fillRect(2*ps, 4*ps, 6*ps, 5*ps);
    
    // Head
    ctx.fillRect(2.5*ps, 1*ps, 5*ps, 3*ps);
    
    // Ears
    ctx.fillStyle = '#ff1493';
    ctx.fillRect(2*ps, 0.5*ps, 1.5*ps, 1.5*ps);
    ctx.fillRect(6.5*ps, 0.5*ps, 1.5*ps, 1.5*ps);
    
    // Camera
    ctx.fillStyle = '#333';
    ctx.fillRect(0.5*ps, 5*ps, 2*ps, 2*ps);
    ctx.fillStyle = '#666';
    ctx.fillRect(1*ps, 5.5*ps, 1*ps, 1*ps);
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(3.5*ps, 2.3*ps, 1*ps, 0.8*ps);
    ctx.fillRect(5.5*ps, 2.3*ps, 1*ps, 0.8*ps);
    
    // Simple mouth
    ctx.fillRect(4*ps, 3.2*ps, 2*ps, 0.4*ps);
    
    // Legs
    ctx.fillStyle = '#ff69b4';
    ctx.fillRect(2.5*ps, 9*ps, 1.8*ps, 2.5*ps);
    ctx.fillRect(5.7*ps, 9*ps, 1.8*ps, 2.5*ps);
    
    // Feet
    ctx.fillStyle = '#ff1493';
    ctx.fillRect(2*ps, 11.5*ps, 2.3*ps, 0.7*ps);
    ctx.fillRect(5.7*ps, 11.5*ps, 2.3*ps, 0.7*ps);
  }
  
  function drawWalking(ps) {
    const walkCycle = Math.floor(pet.animFrame / 8) % 4;
    const bob = Math.sin(pet.animFrame * 0.2) * 0.3;
    
    // Body
    ctx.fillStyle = '#ff69b4';
    ctx.fillRect(2*ps, (4*ps) + bob, 6*ps, 5*ps);
    
    // Head
    ctx.fillRect(2.5*ps, (1*ps) + bob, 5*ps, 3*ps);
    
    // Ears
    ctx.fillStyle = '#ff1493';
    ctx.fillRect(2*ps, (0.5*ps) + bob, 1.5*ps, 1.5*ps);
    ctx.fillRect(6.5*ps, (0.5*ps) + bob, 1.5*ps, 1.5*ps);
    
    // Camera
    ctx.fillStyle = '#333';
    ctx.fillRect(0.5*ps, (5*ps) + bob, 2*ps, 2*ps);
    ctx.fillStyle = '#666';
    ctx.fillRect(1*ps, (5.5*ps) + bob, 1*ps, 1*ps);
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(3.5*ps, (2.3*ps) + bob, 1*ps, 0.8*ps);
    ctx.fillRect(5.5*ps, (2.3*ps) + bob, 1*ps, 0.8*ps);
    
    // Mouth
    ctx.fillRect(4*ps, (3.2*ps) + bob, 2*ps, 0.4*ps);
    
    // Animated legs
    ctx.fillStyle = '#ff69b4';
    if (walkCycle === 0 || walkCycle === 2) {
      ctx.fillRect(2.5*ps, (9*ps) + bob, 1.8*ps, 2.5*ps);
      ctx.fillRect(5.7*ps, (9.3*ps) + bob, 1.8*ps, 2.2*ps);
    } else {
      ctx.fillRect(2.5*ps, (9.3*ps) + bob, 1.8*ps, 2.2*ps);
      ctx.fillRect(5.7*ps, (9*ps) + bob, 1.8*ps, 2.5*ps);
    }
    
    // Feet
    ctx.fillStyle = '#ff1493';
    ctx.fillRect(2*ps, (11.5*ps) + bob, 2.3*ps, 0.7*ps);
    ctx.fillRect(5.7*ps, (11.5*ps) + bob, 2.3*ps, 0.7*ps);
  }
  
  // Update pet logic
  function update() {
    pet.frameCount++;
    
    // Handle movement
    if (keys.left) {
      pet.x -= pet.speed;
      pet.animFrame++;
    }
    if (keys.right) {
      pet.x += pet.speed;
      pet.animFrame++;
    }
    
    // Keep in bounds - prevent going off screen
    pet.x = Math.max(0, Math.min(canvas.width - pet.width, pet.x));
  }
  
  function animate() {
    update();
    drawPet();
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = 200;
    // Keep pet in bounds after resize
    pet.x = Math.max(0, Math.min(canvas.width - pet.width, pet.x));
  });
  
  animate();
})();