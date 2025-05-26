import { Position, Collectible, Level } from "./stores/useGameState";

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityX: number;
    velocityY: number;
    grounded: boolean;
    speed: number;
    jumpPower: number;
  };
  private camera: { x: number; y: number };
  private level: Level | null = null;
  private collectibles: Collectible[] = [];
  private gravity = 0.8;
  private friction = 0.85;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    
    // Initialize player
    this.player = {
      x: 100,
      y: 400,
      width: 24,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      grounded: false,
      speed: 5,
      jumpPower: 15,
    };
    
    // Initialize camera
    this.camera = { x: 0, y: 0 };
    
    console.log("GameEngine initialized");
  }

  setLevel(level: Level) {
    this.level = level;
  }

  setCollectibles(collectibles: Collectible[]) {
    this.collectibles = collectibles;
  }

  setPlayerPosition(position: Position) {
    this.player.x = position.x;
    this.player.y = position.y;
  }

  getPlayerPosition(): Position {
    return { x: this.player.x, y: this.player.y };
  }

  movePlayer(direction: "up" | "down" | "left" | "right") {
    switch (direction) {
      case "left":
        this.player.velocityX = -this.player.speed;
        break;
      case "right":
        this.player.velocityX = this.player.speed;
        break;
      case "up":
        // Only allow movement if not in the air
        if (this.player.grounded) {
          this.playerJump();
        }
        break;
      case "down":
        // Fast fall if in air
        if (!this.player.grounded) {
          this.player.velocityY += 2;
        }
        break;
    }
  }

  playerJump() {
    if (this.player.grounded) {
      this.player.velocityY = -this.player.jumpPower;
      this.player.grounded = false;
      console.log("Player jumped");
    }
  }

  update() {
    if (!this.level) return;

    // Apply gravity
    this.player.velocityY += this.gravity;

    // Apply friction to horizontal movement
    this.player.velocityX *= this.friction;

    // Update position
    this.player.x += this.player.velocityX;
    this.player.y += this.player.velocityY;

    // Platform collision detection
    this.handlePlatformCollisions();

    // Keep player in bounds
    this.player.x = Math.max(0, Math.min(this.level.width - this.player.width, this.player.x));
    
    // Ground collision (bottom of level)
    if (this.player.y + this.player.height >= this.level.height) {
      this.player.y = this.level.height - this.player.height;
      this.player.velocityY = 0;
      this.player.grounded = true;
    }

    // Update camera to follow player
    this.updateCamera();
  }

  private handlePlatformCollisions() {
    if (!this.level) return;

    this.player.grounded = false;

    for (const platform of this.level.platforms) {
      // Check if player intersects with platform
      if (this.player.x < platform.x + platform.width &&
          this.player.x + this.player.width > platform.x &&
          this.player.y < platform.y + platform.height &&
          this.player.y + this.player.height > platform.y) {
        
        // Calculate overlap on each axis
        const overlapX = Math.min(
          this.player.x + this.player.width - platform.x,
          platform.x + platform.width - this.player.x
        );
        const overlapY = Math.min(
          this.player.y + this.player.height - platform.y,
          platform.y + platform.height - this.player.y
        );

        // Resolve collision based on smallest overlap
        if (overlapX < overlapY) {
          // Horizontal collision
          if (this.player.x < platform.x) {
            this.player.x = platform.x - this.player.width;
          } else {
            this.player.x = platform.x + platform.width;
          }
          this.player.velocityX = 0;
        } else {
          // Vertical collision
          if (this.player.y < platform.y) {
            // Player on top of platform
            this.player.y = platform.y - this.player.height;
            this.player.velocityY = 0;
            this.player.grounded = true;
          } else {
            // Player hit platform from below
            this.player.y = platform.y + platform.height;
            this.player.velocityY = 0;
          }
        }
      }
    }
  }

  private updateCamera() {
    if (!this.level) return;

    // Center camera on player
    this.camera.x = this.player.x - this.canvas.width / 2;
    this.camera.y = this.player.y - this.canvas.height / 2;

    // Keep camera within level bounds
    this.camera.x = Math.max(0, Math.min(this.level.width - this.canvas.width, this.camera.x));
    this.camera.y = Math.max(0, Math.min(this.level.height - this.canvas.height, this.camera.y));
  }

  checkCollectibleCollisions(): string[] {
    const collisions: string[] = [];
    
    for (const collectible of this.collectibles) {
      if (!collectible.collected) {
        const distance = Math.sqrt(
          Math.pow(this.player.x + this.player.width / 2 - collectible.x, 2) +
          Math.pow(this.player.y + this.player.height / 2 - collectible.y, 2)
        );
        
        if (distance < 20) {
          collisions.push(collectible.id);
        }
      }
    }
    
    return collisions;
  }

  checkHazardCollision(): boolean {
    if (!this.level) return false;

    for (const hazard of this.level.hazards) {
      const distance = Math.sqrt(
        Math.pow(this.player.x + this.player.width / 2 - hazard.x, 2) +
        Math.pow(this.player.y + this.player.height / 2 - hazard.y, 2)
      );
      
      if (distance < 25) {
        return true;
      }
    }
    
    return false;
  }

  checkLevelComplete(): boolean {
    if (!this.level) return false;

    const allCollected = this.collectibles.every(c => c.collected);
    
    if (allCollected) {
      const distance = Math.sqrt(
        Math.pow(this.player.x + this.player.width / 2 - this.level.goal.x, 2) +
        Math.pow(this.player.y + this.player.height / 2 - this.level.goal.y, 2)
      );
      
      return distance < 30;
    }
    
    return false;
  }

  render() {
    if (!this.level) return;

    // Clear canvas
    this.ctx.fillStyle = "#1a1a2e";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Save context for camera transform
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // Draw platforms
    this.ctx.fillStyle = "#4a5568";
    this.ctx.strokeStyle = "#2d3748";
    this.ctx.lineWidth = 2;
    
    for (const platform of this.level.platforms) {
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Draw collectibles
    for (const collectible of this.collectibles) {
      if (!collectible.collected) {
        this.ctx.save();
        this.ctx.translate(collectible.x, collectible.y);
        
        switch (collectible.type) {
          case "gem":
            this.ctx.fillStyle = "#9f7aea";
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
            this.ctx.fill();
            break;
          case "coin":
            this.ctx.fillStyle = "#ffd700";
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 6, 0, Math.PI * 2);
            this.ctx.fill();
            break;
          case "key":
            this.ctx.fillStyle = "#38b2ac";
            this.ctx.fillRect(-6, -8, 12, 16);
            break;
        }
        
        this.ctx.restore();
      }
    }

    // Draw hazards
    this.ctx.fillStyle = "#e53e3e";
    for (const hazard of this.level.hazards) {
      this.ctx.beginPath();
      this.ctx.arc(hazard.x, hazard.y, 12, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw goal
    this.ctx.fillStyle = "#48bb78";
    this.ctx.strokeStyle = "#38a169";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(this.level.goal.x, this.level.goal.y, 20, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Draw player
    this.ctx.fillStyle = "#4299e1";
    this.ctx.strokeStyle = "#2b6cb0";
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);

    // Draw player eyes
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(this.player.x + 6, this.player.y + 8, 4, 4);
    this.ctx.fillRect(this.player.x + 14, this.player.y + 8, 4, 4);

    // Restore context
    this.ctx.restore();
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
