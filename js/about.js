const config = {
    symbols: ["O", "X", "*", ">", "$", "W"],
    blockSize: 25,
    detectionRadius: 50,
    clusterSize: 7,
    blockLifetime: 300,
    emptyRatio: 0.3,
    scrambleRatio: 0.25,
    scrambleInterval: 150,
  };
  
  function getRandomSymbol() {
    return config.symbols[Math.floor(Math.random() * config.symbols.length)];
  }
  
  function initGridOverlay(element) {
    const gridOverlay = document.createElement("div");
    gridOverlay.className = "grid-overlay";
  
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const cols = Math.ceil(width / config.blockSize);
    const rows = Math.ceil(height / config.blockSize);
  
    const blocks = [];
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.className = "grid-block";
  
        const isEmpty = Math.random() < config.emptyRatio;
        block.textContent = isEmpty ? "" : getRandomSymbol();
  
        block.style.width = `${config.blockSize}px`;
        block.style.height = `${config.blockSize}px`;
        block.style.left = `${col * config.blockSize}px`;
        block.style.top = `${row * config.blockSize}px`;
  
        gridOverlay.appendChild(block);
  
        blocks.push({
          element: block,
          x: col * config.blockSize + config.blockSize / 2,
          y: row * config.blockSize + config.blockSize / 2,
          gridX: col,
          gridY: row,
          highlightEndTime: 0,
          isEmpty: isEmpty,
          shouldScramble: !isEmpty && Math.random() < config.scrambleRatio,
          scrambleInterval: null,
        });
      }
    }
  
    element.appendChild(gridOverlay);
  
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
  
      let closestBlock = null;
      let closestDistance = Infinity;
  
      for (const block of blocks) {
        const dx = mouseX - block.x;
        const dy = mouseY - block.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < closestDistance) {
          closestDistance = distance;
          closestBlock = block;
        }
      }
  
      if (!closestBlock || closestDistance > config.detectionRadius) return;
  
      const currentTime = Date.now();
      closestBlock.element.classList.add("active");
      closestBlock.highlightEndTime = currentTime + config.blockLifetime;
  
      if (closestBlock.shouldScramble && !closestBlock.scrambleInterval) {
        closestBlock.scrambleInterval = setInterval(() => {
          closestBlock.element.textContent = getRandomSymbol();
        }, config.scrambleInterval);
      }
  
      const clusterCount = Math.floor(Math.random() * config.clusterSize) + 1;
      let currentBlock = closestBlock;
      let activeBlocks = [closestBlock];
  
      for (let i = 0; i < clusterCount; i++) {
        const neighbors = blocks.filter((neighbor) => {
          if (activeBlocks.includes(neighbor)) return false;
  
          const dx = Math.abs(neighbor.gridX - currentBlock.gridX);
          const dy = Math.abs(neighbor.gridY - currentBlock.gridY);
  
          return dx <= 1 && dy <= 1;
        });
  
        if (neighbors.length === 0) break;
  
        const randomNeighbor =
          neighbors[Math.floor(Math.random() * neighbors.length)];
  
        randomNeighbor.element.classList.add("active");
        randomNeighbor.highlightEndTime =
          currentTime + config.blockLifetime + i * 10;
  
        if (randomNeighbor.shouldScramble && !randomNeighbor.scrambleInterval) {
          randomNeighbor.scrambleInterval = setInterval(() => {
            randomNeighbor.element.textContent = getRandomSymbol();
          }, config.scrambleInterval);
        }
  
        activeBlocks.push(randomNeighbor);
        currentBlock = randomNeighbor;
      }
    });
  
    function updateHighlights() {
      const currentTime = Date.now();
  
      blocks.forEach((block) => {
        if (block.highlightEndTime > 0 && currentTime > block.highlightEndTime) {
          block.element.classList.remove("active");
          block.highlightEndTime = 0;
  
          if (block.scrambleInterval) {
            clearInterval(block.scrambleInterval);
            block.scrambleInterval = null;
            if (!block.isEmpty) {
              block.element.textContent = getRandomSymbol();
            }
          }
        }
      });
  
      requestAnimationFrame(updateHighlights);
    }
  
    updateHighlights();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".hover-img").forEach((element) => {
      initGridOverlay(element);
    });
  });
  
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