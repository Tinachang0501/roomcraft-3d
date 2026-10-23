/**
 * Procedural Texture Generator for RoomCraft 3D
 * Generates seamless procedural textures via HTML5 Canvas for zero-latency, offline 3D rendering.
 */

const ProceduralTextures = {
  cache: {},

  hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  },

  // 1. 淺色/原木橡木地板 (Plank Wood Floor)
  createOakTexture(hexColor = '#CDB296', planksX = 6, planksY = 16) {
    const key = `oak_${hexColor}_${planksX}_${planksY}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const base = this.hexToRgb(hexColor);

    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, 1024, 1024);

    const plankW = 1024 / planksX;
    const plankH = 1024 / planksY;

    for (let x = 0; x < planksX; x++) {
      for (let y = 0; y < planksY; y++) {
        const px = x * plankW;
        const py = y * plankH;

        // 微幅個別板片色偏
        const shift = (Math.random() - 0.5) * 26;
        const r = Math.min(255, Math.max(0, base.r + shift));
        const g = Math.min(255, Math.max(0, base.g + shift * 0.9));
        const b = Math.min(255, Math.max(0, base.b + shift * 0.7));

        ctx.fillStyle = `rgb(${r|0}, ${g|0}, ${b|0})`;
        ctx.fillRect(px, py, plankW, plankH);

        // 木紋線條
        ctx.save();
        ctx.beginPath();
        ctx.rect(px, py, plankW, plankH);
        ctx.clip();

        ctx.strokeStyle = `rgba(${Math.max(0, r - 35)}, ${Math.max(0, g - 35)}, ${Math.max(0, b - 35)}, 0.2)`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
          const ly = py + Math.random() * plankH;
          ctx.beginPath();
          ctx.moveTo(px, ly);
          ctx.bezierCurveTo(
            px + plankW * 0.33, ly + (Math.random() - 0.5) * 6,
            px + plankW * 0.66, ly + (Math.random() - 0.5) * 6,
            px + plankW, ly
          );
          ctx.stroke();
        }

        // 接縫倒角陰影 (Grooves)
        ctx.fillStyle = 'rgba(40, 25, 15, 0.45)';
        ctx.fillRect(px, py + plankH - 1.5, plankW, 1.5);
        ctx.fillRect(px + plankW - 1.5, py, 1.5, plankH);

        ctx.restore();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    this.cache[key] = texture;
    return texture;
  },

  // 2. 人字拼木地板 (Herringbone Parquet)
  createHerringboneTexture(hexColor = '#BA9A7A') {
    const key = `herringbone_${hexColor}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const base = this.hexToRgb(hexColor);

    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, 1024, 1024);

    const step = 64;
    for (let y = -step; y < 1024 + step; y += step) {
      for (let x = -step; x < 1024 + step; x += step * 2) {
        const toneShift = (Math.random() - 0.5) * 35;
        const r = Math.min(255, Math.max(0, base.r + toneShift));
        const g = Math.min(255, Math.max(0, base.g + toneShift * 0.9));
        const b = Math.min(255, Math.max(0, base.b + toneShift * 0.8));

        ctx.fillStyle = `rgb(${r|0}, ${g|0}, ${b|0})`;
        ctx.strokeStyle = 'rgba(50, 30, 15, 0.5)';
        ctx.lineWidth = 1.5;

        // 斜向木條 1 (45度)
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + step, y + step);
        ctx.lineTo(x + step * 1.5, y + step * 0.5);
        ctx.lineTo(x + step * 0.5, y - step * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 另一向木條 2
        ctx.beginPath();
        ctx.moveTo(x + step, y + step);
        ctx.lineTo(x + step * 2, y);
        ctx.lineTo(x + step * 1.5, y - step * 0.5);
        ctx.lineTo(x + step * 0.5, y + step * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    this.cache[key] = texture;
    return texture;
  },

  // 3. 義大利魚肚白大理石 (Calacatta White Marble)
  createMarbleTexture(baseHex = '#F7F6F2', veinColor = '#7A8086') {
    const key = `marble_${baseHex}_${veinColor}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const base = this.hexToRgb(baseHex);

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 1024, 1024);

    // 柔和微雲霧底色
    for (let i = 0; i < 8; i++) {
      const grad = ctx.createRadialGradient(
        Math.random() * 1024, Math.random() * 1024, 50,
        Math.random() * 1024, Math.random() * 1024, 600
      );
      grad.addColorStop(0, 'rgba(215, 218, 222, 0.25)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);
    }

    // 大理石主要灰金裂紋 (Organic Veins)
    function drawVein(startX, startY, len, angle, depth, width) {
      if (depth <= 0) return;
      ctx.strokeStyle = `rgba(100, 108, 115, ${0.15 + (depth / 6) * 0.25})`;
      ctx.lineWidth = width;
      ctx.beginPath();
      let curX = startX;
      let curY = startY;
      ctx.moveTo(curX, curY);

      const segments = 8;
      for (let s = 0; s < segments; s++) {
        angle += (Math.random() - 0.5) * 0.5;
        curX += Math.cos(angle) * (len / segments);
        curY += Math.sin(angle) * (len / segments);
        ctx.lineTo(curX, curY);
      }
      ctx.stroke();

      if (Math.random() > 0.4) {
        drawVein(curX, curY, len * 0.65, angle + 0.6, depth - 1, width * 0.7);
      }
      if (Math.random() > 0.5) {
        drawVein(curX, curY, len * 0.65, angle - 0.6, depth - 1, width * 0.7);
      }
    }

    drawVein(100, 50, 700, 0.75, 5, 4.5);
    drawVein(650, 150, 600, 1.85, 4, 3.5);
    drawVein(300, 700, 550, -0.45, 4, 3.0);

    // 金質微礦紋
    ctx.strokeStyle = 'rgba(189, 158, 108, 0.35)';
    ctx.lineWidth = 1.2;
    drawVein(400, 300, 500, 0.8, 3, 1.5);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    this.cache[key] = texture;
    return texture;
  },

  // 4. 清水模 / 侘寂微水泥 (Micro-cement / Concrete)
  createCementTexture(hexColor = '#C6C5BF') {
    const key = `cement_${hexColor}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const base = this.hexToRgb(hexColor);

    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, 1024, 1024);

    // 鏝刀鏝抹層次 (Trowel Marks)
    for (let i = 0; i < 40; i++) {
      const grad = ctx.createLinearGradient(
        Math.random() * 1024, Math.random() * 1024,
        Math.random() * 1024, Math.random() * 1024
      );
      const alpha = 0.04 + Math.random() * 0.08;
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(0.5, `rgba(60, 60, 60, ${alpha * 0.7})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, Math.random() * 1024, 180 + Math.random() * 200, 80 + Math.random() * 100, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // 氣孔微顆粒
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() > 0.88) {
        const noise = (Math.random() - 0.5) * 18;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    this.cache[key] = texture;
    return texture;
  },

  // 5. 水磨石地坪 (Terrazzo)
  createTerrazzoTexture(baseHex = '#ECE7DE') {
    const key = `terrazzo_${baseHex}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 1024, 1024);

    const chipColors = ['#A85A48', '#38464B', '#B4A286', '#72807A', '#E3B887', '#5B4033'];
    for (let i = 0; i < 900; i++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 1024;
      const size = 3 + Math.random() * 12;
      const col = chipColors[Math.floor(Math.random() * chipColors.length)];

      ctx.fillStyle = col;
      ctx.beginPath();
      const points = 3 + Math.floor(Math.random() * 4);
      for (let p = 0; p < points; p++) {
        const ang = (p / points) * Math.PI * 2 + Math.random() * 0.4;
        const rad = size * (0.6 + Math.random() * 0.7);
        const px = cx + Math.cos(ang) * rad;
        const py = cy + Math.sin(ang) * rad;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    this.cache[key] = texture;
    return texture;
  },

  // 6. 現代沙發布藝織紋 (Woven Fabric)
  createFabricTexture(hexColor = '#D4C9BA') {
    const key = `fabric_${hexColor}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, 512, 512);

    const base = this.hexToRgb(hexColor);
    // 經緯交叉細紋
    ctx.lineWidth = 1;
    for (let y = 0; y < 512; y += 4) {
      ctx.strokeStyle = `rgba(${Math.max(0, base.r - 20)}, ${Math.max(0, base.g - 20)}, ${Math.max(0, base.b - 20)}, 0.18)`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    for (let x = 0; x < 512; x += 4) {
      ctx.strokeStyle = `rgba(${Math.min(255, base.r + 25)}, ${Math.min(255, base.g + 25)}, ${Math.min(255, base.b + 25)}, 0.15)`;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    this.cache[key] = texture;
    return texture;
  },

  // 7. 羊毛地毯質感 (Wool Rug Texture)
  createRugTexture(hexColor = '#E6E1D8') {
    const key = `rug_${hexColor}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, 512, 512);

    // 簡約有機弧線幾何圖騰 (Modern Scandinavian Rug Pattern)
    ctx.strokeStyle = 'rgba(70, 65, 60, 0.12)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 128, 110, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(256, 384, 110, Math.PI, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(60, 256);
    ctx.lineTo(452, 256);
    ctx.stroke();

    // 圈絨顆粒
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.06)';
      ctx.fillRect(rx, ry, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache[key] = texture;
    return texture;
  },

  // 8. 現代抽象藝術掛畫 (Wall Art)
  createArtTexture(paletteType = 'cream') {
    const key = `art_${paletteType}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    // 底色
    ctx.fillStyle = '#F5F2EB';
    ctx.fillRect(0, 0, 512, 768);

    // 幾何弧形與色彩碰撞
    ctx.fillStyle = '#D9825B'; // 陶土焦糖
    ctx.beginPath();
    ctx.arc(256, 300, 160, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#40505A'; // 霧墨深藍
    ctx.beginPath();
    ctx.rect(140, 260, 232, 280);
    ctx.fill();

    ctx.fillStyle = '#C2B49F'; // 燕麥棕
    ctx.beginPath();
    ctx.arc(256, 520, 100, Math.PI, 0);
    ctx.fill();

    // 細黑線條
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(80, 200);
    ctx.bezierCurveTo(200, 100, 312, 450, 432, 380);
    ctx.stroke();

    // 畫框內陰影
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 12;
    ctx.strokeRect(0, 0, 512, 768);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache[key] = texture;
    return texture;
  },

  // 9. 窗外都市/園景景觀 (Window Skyline / Day / Night)
  createWindowViewTexture(timeOfDay = 'day') {
    const key = `sky_${timeOfDay}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (timeOfDay === 'day') {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#75B6E7');
      grad.addColorStop(0.65, '#C6E4FB');
      grad.addColorStop(1, '#EBF4F9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // 遠景建築剪影與綠樹
      ctx.fillStyle = 'rgba(160, 190, 215, 0.4)';
      for (let i = 0; i < 25; i++) {
        const bw = 30 + Math.random() * 50;
        const bh = 80 + Math.random() * 160;
        ctx.fillRect(i * 42, 512 - bh - 60, bw, bh);
      }
      // 近景綠葉剪影
      ctx.fillStyle = '#4A6B53';
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(i * 38, 512 - 20, 40 + Math.random() * 25, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (timeOfDay === 'sunset') {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#593B6E');
      grad.addColorStop(0.4, '#C86851');
      grad.addColorStop(0.8, '#F5A962');
      grad.addColorStop(1, '#FFE7AA');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // 金黃夕陽光球
      const sunGrad = ctx.createRadialGradient(720, 260, 10, 720, 260, 220);
      sunGrad.addColorStop(0, 'rgba(255, 240, 200, 0.95)');
      sunGrad.addColorStop(0.5, 'rgba(255, 170, 80, 0.4)');
      sunGrad.addColorStop(1, 'rgba(255, 170, 80, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, 1024, 512);
    } else { // night
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#0B132B');
      grad.addColorStop(0.6, '#1C2541');
      grad.addColorStop(1, '#243254');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // 繁星點點與城市燈火
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = Math.random() > 0.3 ? '#FFF5C0' : '#A9D6E5';
        ctx.fillRect(Math.random() * 1024, Math.random() * 320, 1.5, 1.5);
      }
      // 遠方大樓暖黃窗光
      ctx.fillStyle = 'rgba(15, 20, 35, 0.9)';
      for (let i = 0; i < 30; i++) {
        const bw = 35 + Math.random() * 45;
        const bh = 100 + Math.random() * 220;
        const bx = i * 36;
        ctx.fillRect(bx, 512 - bh, bw, bh);

        ctx.fillStyle = 'rgba(255, 220, 130, 0.6)';
        for (let wy = 512 - bh + 10; wy < 500; wy += 14) {
          if (Math.random() > 0.4) {
            ctx.fillRect(bx + 6, wy, 4, 6);
            ctx.fillRect(bx + 16, wy, 4, 6);
          }
        }
        ctx.fillStyle = 'rgba(15, 20, 35, 0.9)';
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache[key] = texture;
    return texture;
  }
};
