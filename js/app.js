/**
 * Main Application Controller for RoomCraft 3D
 * Supports 12 distinct spaces across residential, outdoor, campervan, and retail displays.
 * Integrates Vendor Material Uploads and Custom Furniture Dimension/Photo Mockup Simulation.
 */

class App {
  constructor() {
    this.viewer = null;
    this.state = {
      spaceType: 'living',
      pings: 10,
      floor: MaterialsData.floors[0],
      wallColor: MaterialsData.wallColors[0].hex,
      sofaHex: MaterialsData.sofaFabrics[0].hex,
      accentHex: MaterialsData.accentColors[0].hex,
      isAccentMetal: true,
      timeOfDay: 'day',
      activeTab: 'materials',
      uploadedImage: null,
      extractedColors: [],
      // 廠商自訂材質清單
      customVendorMaterials: [],
      // 自訂家具規劃與照片模擬
      customFurniture: {
        name: '新挑選品牌沙發',
        lengthCm: 220,
        widthCm: 90,
        heightCm: 80,
        photoUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        in3D: false
      }
    };

    this.init();
  }

  init() {
    // 1. 初始化 3D 視圖
    this.viewer = new RoomViewer('canvas-container');

    // 2. 渲染 UI 面板
    this.renderSpaceSelector();
    this.renderFloorOptions();
    this.renderWallColorOptions();
    this.renderSofaOptions();
    this.renderAccentOptions();
    this.renderPresetStyles();
    this.renderYouTubeVideos();
    this.renderRealCases();
    this.renderCustomMaterialsList();
    this.renderBathroomStudio();

    // 3. 綁定事件監聽
    this.bindControls();
    this.bindPhotoUploader();
    this.bindVendorMaterialUploader();
    this.bindCustomFurnitureUploader();

    // 4. 初次計算診斷與配比
    this.updateAdviceAndProportions();
  }

  // 渲染頂部空間切換器 (包含衛浴等 12 大空間)
  renderSpaceSelector() {
    const bar = document.getElementById('space-selector-bar');
    if (!bar) return;

    bar.innerHTML = MaterialsData.spaces.map(s => {
      const isActive = s.id === this.state.spaceType;
      return `
        <button onclick="window.app.switchSpace('${s.id}')"
                class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm flex-shrink-0 ${isActive ? 'bg-stone-900 text-white ring-2 ring-stone-900' : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900 border border-stone-200'}">
          <span class="text-sm">${s.icon}</span>
          <span>${s.name}</span>
        </button>
      `;
    }).join('');
  }

  // 切換空間配置
  switchSpace(spaceId) {
    const space = MaterialsData.spaces.find(s => s.id === spaceId);
    if (!space) return;

    this.state.spaceType = spaceId;
    this.state.pings = space.defaultPings;

    const slider = document.getElementById('pings-slider');
    const sliderVal = document.getElementById('slider-val');
    if (slider) {
      slider.min = space.minPings;
      slider.max = space.maxPings;
      slider.value = space.defaultPings;
    }
    if (sliderVal) sliderVal.textContent = space.defaultPings;

    const defFloor = MaterialsData.floors.find(f => f.id === space.defaultFloor) || MaterialsData.floors[0];
    this.state.floor = defFloor;
    this.state.wallColor = space.defaultWall || '#F7F4EE';

    this.viewer.rebuildSpace(spaceId);
    this.viewer.updateFloor(defFloor);
    this.viewer.updateWallColor(this.state.wallColor);
    this.viewer.updateSofa(this.state.sofaHex);
    this.viewer.updateAccent(this.state.accentHex, this.state.isAccentMetal);

    this.renderSpaceSelector();
    this.renderFloorOptions();
    this.renderWallColorOptions();
    this.renderPresetStyles();
    this.renderYouTubeVideos();
    this.renderRealCases();
    this.updateAdviceAndProportions();

    const spaceBadge = document.getElementById('current-space-badge');
    const spaceFocus = document.getElementById('current-space-focus');
    if (spaceBadge) spaceBadge.textContent = `${space.icon} ${space.name}`;
    if (spaceFocus) spaceFocus.textContent = space.furnitureFocus;

    this.showToast(`✨ 已切換至「${space.name}」配置模式！`);
  }

  // 1. 渲染地坪材質選單
  renderFloorOptions() {
    const container = document.getElementById('floor-options-container');
    if (!container) return;

    container.innerHTML = MaterialsData.floors.map(f => {
      const bgStyle = f.image 
        ? `background-image: url('${f.image}'); background-size: cover; background-position: center;` 
        : `background-color: ${f.color};`;
      const isActive = f.id === this.state.floor.id;
      return `
      <div class="material-chip p-2.5 rounded-xl border bg-white cursor-pointer hover:shadow-sm ${isActive ? 'active ring-2 ring-stone-800' : 'border-stone-200'}"
           onclick="window.app.selectFloor('${f.id}')">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg shadow-inner flex-shrink-0" style="${bgStyle} border: 1px solid rgba(0,0,0,0.12)"></div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-stone-800 text-xs truncate">${f.name}</div>
            <div class="text-[11px] text-stone-600 truncate">${f.tags[0]}</div>
          </div>
        </div>
      </div>
    `;
    }).join('');
  }

  // 2. 渲染牆面色卡
  renderWallColorOptions() {
    const container = document.getElementById('wall-options-container');
    if (!container) return;

    container.innerHTML = MaterialsData.wallColors.map(w => {
      const bgStyle = w.image 
        ? `background-image: url('${w.image}'); background-size: cover; background-position: center;` 
        : `background-color: ${w.hex};`;
      const isSelected = w.image 
        ? (this.state.wallImage === w.image) 
        : (this.state.wallColor && this.state.wallColor.toLowerCase() === w.hex.toLowerCase() && !this.state.wallImage);

      return `
      <div class="p-2 rounded-xl border bg-white cursor-pointer transition-all hover:scale-105 ${isSelected ? 'ring-2 ring-stone-800 shadow-sm' : 'border-stone-200'}"
           onclick="window.app.selectWallItem('${w.id}')" title="${w.name}">
        <div class="w-full h-8 rounded-lg shadow-inner mb-1.5" style="${bgStyle} border: 1px solid rgba(0,0,0,0.08)"></div>
        <div class="text-[11px] font-medium text-stone-700 truncate text-center">${w.name.split(' ')[0]}</div>
      </div>
    `;
    }).join('');
  }

  // 3. 渲染家具布藝
  renderSofaOptions() {
    const container = document.getElementById('sofa-options-container');
    if (!container) return;

    container.innerHTML = MaterialsData.sofaFabrics.map(s => `
      <div class="flex items-center justify-between p-2 rounded-xl border bg-white cursor-pointer hover:bg-stone-50 transition-all ${s.hex.toLowerCase() === this.state.sofaHex.toLowerCase() ? 'ring-2 ring-stone-800 font-semibold' : 'border-stone-200'}"
           onclick="window.app.selectSofa('${s.hex}')">
        <div class="flex items-center space-x-2.5">
          <span class="w-6 h-6 rounded-full shadow-inner inline-block" style="background-color: ${s.hex}; border: 1px solid rgba(0,0,0,0.1)"></span>
          <span class="text-xs text-stone-800">${s.name}</span>
        </div>
        <span class="text-[10px] text-stone-600 uppercase px-1.5 py-0.5 bg-stone-100 rounded">${s.style}</span>
      </div>
    `).join('');
  }

  // 4. 渲染點綴色
  renderAccentOptions() {
    const container = document.getElementById('accent-options-container');
    if (!container) return;

    container.innerHTML = MaterialsData.accentColors.map(a => `
      <div class="flex items-center space-x-2 p-1.5 px-2.5 rounded-lg border bg-white cursor-pointer transition-all ${a.hex.toLowerCase() === this.state.accentHex.toLowerCase() ? 'ring-2 ring-stone-800 bg-stone-100' : 'border-stone-200'}"
           onclick="window.app.selectAccent('${a.hex}', ${a.isMetal})">
        <span class="w-4 h-4 rounded-full shadow-inner" style="background-color: ${a.hex}; border: 1px solid rgba(0,0,0,0.1)"></span>
        <span class="text-xs text-stone-700 font-medium">${a.name}</span>
      </div>
    `).join('');
  }

  // 5. 渲染預設風格卡片
  renderPresetStyles() {
    const container = document.getElementById('preset-styles-container');
    if (!container) return;

    const currentSpaceId = this.state.spaceType;
    const sortedPresets = [...MaterialsData.stylePresets].sort((a, b) => {
      if (a.spaceId === currentSpaceId) return -1;
      if (b.spaceId === currentSpaceId) return 1;
      return 0;
    });

    container.innerHTML = sortedPresets.slice(0, 4).map(p => `
      <div class="p-3 rounded-2xl border ${p.spaceId === currentSpaceId ? 'border-amber-400 bg-amber-50/20' : 'border-stone-200 bg-white'} hover:border-stone-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
           onclick="window.app.applyPreset('${p.id}')">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold text-stone-800">${p.name}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full ${p.spaceId === currentSpaceId ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'} font-medium">${p.badge}</span>
          </div>
          <p class="text-[11px] text-stone-600 leading-relaxed mb-3">${p.tagline}</p>
        </div>
        <div class="flex items-center space-x-1.5 pt-2 border-t border-stone-100">
          <span class="text-[10px] text-stone-600 mr-1">色盤:</span>
          <span class="w-3.5 h-3.5 rounded-full shadow-inner border border-black/10" style="background:${p.wallColor}"></span>
          <span class="w-3.5 h-3.5 rounded-full shadow-inner border border-black/10" style="background:${p.sofaHex}"></span>
          <span class="w-3.5 h-3.5 rounded-full shadow-inner border border-black/10" style="background:${p.accentHex}"></span>
        </div>
      </div>
    `).join('');
  }

  // 6. 渲染 YouTube 推薦影片
  renderYouTubeVideos() {
    const container = document.getElementById('youtube-videos-container');
    if (!container) return;

    const currentSpace = this.state.spaceType;
    const sortedVideos = [...YouTubeCasesData.videos].sort((a, b) => {
      if (a.spaceId === currentSpace) return -1;
      if (b.spaceId === currentSpace) return 1;
      return 0;
    });

    container.innerHTML = sortedVideos.map(v => `
      <div class="video-card bg-white rounded-2xl border ${v.spaceId === currentSpace ? 'border-amber-400 ring-1 ring-amber-300' : 'border-stone-200'} overflow-hidden cursor-pointer"
           onclick="window.app.openVideoModal('${v.youtubeId}', '${v.title.replace(/'/g, "\\'")}', '${v.summary.replace(/'/g, "\\'")}')">
        <div class="relative h-32 w-full bg-stone-200 overflow-hidden">
          <img src="${v.cover}" alt="${v.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy">
          <div class="absolute inset-0 bg-black/25 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
            <div class="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform transition hover:scale-110">
              <svg class="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <span class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 text-white text-[10px] rounded font-mono">${v.duration}</span>
          ${v.spaceId === currentSpace ? '<span class="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-md">目前空間推薦</span>' : ''}
        </div>
        <div class="p-3">
          <div class="text-xs font-bold text-stone-800 line-clamp-2 leading-tight mb-1">${v.title}</div>
          <div class="text-[11px] text-stone-600 mb-2">${v.channel} · <span class="text-amber-800">${v.category}</span></div>
          <p class="text-[11px] text-stone-600 line-clamp-2 mb-2">${v.summary}</p>
          <div class="flex flex-wrap gap-1">
            ${v.tags.map(t => `<span class="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded">#${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  // 7. 渲染實體案例靈感庫
  renderRealCases() {
    const container = document.getElementById('real-cases-container');
    if (!container) return;

    const currentSpace = this.state.spaceType;
    const sortedCases = [...YouTubeCasesData.realCases].sort((a, b) => {
      if (a.spaceId === currentSpace) return -1;
      if (b.spaceId === currentSpace) return 1;
      return 0;
    });

    container.innerHTML = sortedCases.map(c => `
      <div class="bg-white rounded-2xl border ${c.spaceId === currentSpace ? 'border-amber-400 ring-1 ring-amber-300' : 'border-stone-200'} overflow-hidden shadow-sm hover:shadow-md transition-all">
        <div class="relative h-44 w-full bg-stone-200 overflow-hidden">
          <img src="${c.image}" alt="${c.title}" class="w-full h-full object-cover" loading="lazy">
          <span class="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[11px] rounded-full">${c.area}</span>
          ${c.spaceId === currentSpace ? '<span class="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-md">同款空間</span>' : ''}
        </div>
        <div class="p-3.5">
          <div class="text-xs font-bold text-stone-800 mb-1">${c.title}</div>
          <div class="text-[11px] text-amber-800 font-medium mb-2">${c.style}</div>
          <p class="text-[11px] text-stone-600 leading-relaxed mb-3">${c.highlights}</p>
          <div class="flex items-center space-x-1.5 pt-2 border-t border-stone-100">
            <span class="text-[10px] text-stone-600">色票搭配:</span>
            ${c.palette.map(color => `
              <span class="w-4 h-4 rounded-full border border-black/10 shadow-inner" style="background:${color}" title="${color}"></span>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  // ================= 廠商材質照片上傳與套用功能 =================
  bindVendorMaterialUploader() {
    const input = document.getElementById('vendor-material-input');
    if (!input) return;

    input.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.processVendorMaterial(e.target.files[0]);
      }
    });
  }

  processVendorMaterial(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const targetSelect = document.getElementById('vendor-material-target');
      const target = targetSelect ? targetSelect.value : 'floor';
      const nameInput = document.getElementById('vendor-material-name');
      const name = (nameInput && nameInput.value.trim()) || `廠商材質 ${this.state.customVendorMaterials.length + 1}`;

      // 提取該照片主色
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        let r = 0, g = 0, b = 0;
        const total = (data.length / 4);
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i+1];
          b += data[i+2];
        }
        r = Math.round(r / total);
        g = Math.round(g / total);
        b = Math.round(b / total);
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

        const newMat = {
          id: 'vendor_' + Date.now(),
          name,
          target,
          dataUrl,
          hex
        };

        this.state.customVendorMaterials.unshift(newMat);
        this.renderCustomMaterialsList();

        // 立即套用到 3D 空間
        this.applyCustomVendorMaterial(newMat.id);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  applyCustomVendorMaterial(matId) {
    const mat = this.state.customVendorMaterials.find(m => m.id === matId);
    if (!mat) return;

    this.viewer.applyCustomTexture(mat.target, mat.dataUrl);

    if (mat.target === 'floor') {
      this.state.floor = { name: mat.name, color: mat.hex, type: 'custom', tags: ['廠商客製照片'] };
    } else if (mat.target === 'wall') {
      this.state.wallColor = mat.hex;
    } else if (mat.target === 'sofa') {
      this.state.sofaHex = mat.hex;
    }

    this.updateAdviceAndProportions();
    this.showToast(`✨ 已成功套用廠商材質「${mat.name}」至 3D ${mat.target === 'floor' ? '地坪' : mat.target === 'wall' ? '牆面' : '家具'}！`);
  }

  renderCustomMaterialsList() {
    const container = document.getElementById('custom-materials-list');
    if (!container) return;

    if (this.state.customVendorMaterials.length === 0) {
      container.innerHTML = `<div class="text-[11px] text-stone-500 text-center py-2">尚未上傳自訂廠商材質照片</div>`;
      return;
    }

    container.innerHTML = this.state.customVendorMaterials.map(m => `
      <div class="flex items-center justify-between p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition">
        <div class="flex items-center space-x-2.5 min-w-0">
          <img src="${m.dataUrl}" class="w-8 h-8 rounded-lg object-cover shadow-sm flex-shrink-0" alt="${m.name}">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-stone-800 truncate">${m.name}</div>
            <div class="text-[10px] text-stone-500">套用至: ${m.target === 'floor' ? '地板' : m.target === 'wall' ? '主牆' : '家具'} · ${m.hex}</div>
          </div>
        </div>
        <button onclick="window.app.applyCustomVendorMaterial('${m.id}')" class="px-2.5 py-1 text-[11px] bg-stone-900 text-white rounded-lg hover:bg-stone-800 flex-shrink-0 transition">
          套用
        </button>
      </div>
    `).join('');
  }

  // ================= 自訂家具照片與尺寸規劃模擬 (Furniture Planner) =================
  openFurnitureModal() {
    const modal = document.getElementById('furniture-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.updateFurnitureSimulation();
  }

  closeFurnitureModal() {
    const modal = document.getElementById('furniture-modal');
    if (modal) modal.classList.add('hidden');
  }

  bindCustomFurnitureUploader() {
    const input = document.getElementById('custom-furniture-photo-input');
    if (!input) return;

    input.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          this.state.customFurniture.photoUrl = ev.target.result;
          const previewImg = document.getElementById('furniture-photo-preview');
          if (previewImg) previewImg.src = ev.target.result;
          this.updateFurnitureSimulation();
          this.showToast('📸 已載入家具實體照片！');
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  // 更新使用者填寫的長寬高尺寸並重新計算配比與模擬圖
  updateFurnitureDimensions() {
    const nameInput = document.getElementById('furn-input-name');
    const lengthInput = document.getElementById('furn-input-length');
    const widthInput = document.getElementById('furn-input-width');
    const heightInput = document.getElementById('furn-input-height');

    if (nameInput) this.state.customFurniture.name = nameInput.value || '自選家具';
    if (lengthInput) this.state.customFurniture.lengthCm = parseFloat(lengthInput.value) || 200;
    if (widthInput) this.state.customFurniture.widthCm = parseFloat(widthInput.value) || 90;
    if (heightInput) this.state.customFurniture.heightCm = parseFloat(heightInput.value) || 80;

    this.updateFurnitureSimulation();
  }

  // 執行尺寸配比分析與繪製 2D 比例圖
  updateFurnitureSimulation() {
    const furn = this.state.customFurniture;
    const analysis = AdviceEngine.calculateFurnitureProportions(this.state.pings, furn);

    // 更新資訊卡片
    const ratioBadge = document.getElementById('sim-ratio-badge');
    const ratioVal = document.getElementById('sim-ratio-val');
    const adviceText = document.getElementById('sim-advice-text');
    const walkwayVal = document.getElementById('sim-walkway-val');
    const areaVal = document.getElementById('sim-area-val');

    if (ratioBadge) {
      ratioBadge.textContent = analysis.statusText;
      ratioBadge.className = `px-2 py-0.5 rounded-full text-[11px] font-bold border ${analysis.statusClass}`;
    }
    if (ratioVal) ratioVal.textContent = `${analysis.ratioPercent}%`;
    if (adviceText) adviceText.textContent = analysis.advice;
    if (walkwayVal) walkwayVal.textContent = `預估走道寬度約 ${analysis.approxWalkwayCm} cm`;
    if (areaVal) areaVal.textContent = `家具佔地 ${analysis.furnAreaM2} m² / 空間總計 ${analysis.roomM2} m²`;

    // 繪製 2D 比例平面模擬圖
    this.drawFurnitureFloorplan(analysis);

    // 如果已開啟 3D 投放，同步更新 3D
    if (this.state.customFurniture.in3D) {
      this.viewer.addCustomFurnitureBox(this.state.customFurniture);
    }
  }

  // 繪製高精度 2D 比例平面規劃配置圖
  drawFurnitureFloorplan(analysis) {
    const canvas = document.getElementById('furniture-floorplan-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cw = canvas.width = 600;
    const ch = canvas.height = 420;

    // 清空背景
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(0, 0, cw, ch);

    // 繪製網格
    ctx.strokeStyle = '#ECE7DF';
    ctx.lineWidth = 1;
    for (let x = 0; x < cw; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke();
    }
    for (let y = 0; y < ch; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
    }

    // 計算房間繪圖邊界 (等比例放大)
    const padding = 45;
    const rw = cw - padding * 2;
    const rh = ch - padding * 2;

    // 牆體外框
    ctx.strokeStyle = '#4A463F';
    ctx.lineWidth = 8;
    ctx.strokeRect(padding, padding, rw, rh);

    // 地坪底色 (使用目前選中的地坪色)
    ctx.fillStyle = this.state.floor.color || '#D2B99B';
    ctx.globalAlpha = 0.35;
    ctx.fillRect(padding + 4, padding + 4, rw - 8, rh - 8);
    ctx.globalAlpha = 1.0;

    // 標示房間尺寸與坪數
    ctx.fillStyle = '#26221D';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`房間格局: ${this.state.pings} 坪 (${analysis.roomM2} m²)`, padding + 12, padding + 22);

    // 計算家具在畫布上的實際比例尺寸
    // 假設房間在平面上以長寬比例映射
    const roomM2 = this.state.pings * 3.3058;
    const roomSpanCm = Math.sqrt(roomM2) * 100;
    const scale = rw / roomSpanCm;

    const fw = Math.max(40, Math.min(rw - 20, analysis.lengthCm * scale));
    const fd = Math.max(30, Math.min(rh - 20, analysis.widthCm * scale));
    const fx = padding + (rw - fw) / 2;
    const fy = padding + (rh - fd) / 2;

    // 繪製家具外框與陰影
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    // 若有上傳照片，貼上縮放的照片
    if (this.state.customFurniture.photoUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, fx, fy, fw, fd);
        // 邊框
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.strokeRect(fx, fy, fw, fd);

        // 標記尺寸文字
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${analysis.name}: ${analysis.lengthCm} × ${analysis.widthCm} cm`, fx, fy - 8);

        // 繪製兩側剩餘動線標記
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);

        // 左側動線箭頭線
        ctx.beginPath();
        ctx.moveTo(padding, fy + fd / 2);
        ctx.lineTo(fx, fy + fd / 2);
        ctx.stroke();

        ctx.fillStyle = '#1D4ED8';
        ctx.font = '10px monospace';
        ctx.fillText(`← 動線約 ${analysis.approxWalkwayCm}cm →`, padding + 6, fy + fd / 2 - 6);
        ctx.restore();
      };
      img.src = this.state.customFurniture.photoUrl;
    } else {
      ctx.fillStyle = '#D97706';
      ctx.fillRect(fx, fy, fw, fd);
      ctx.strokeStyle = '#92400E';
      ctx.lineWidth = 2;
      ctx.strokeRect(fx, fy, fw, fd);
      ctx.restore();
    }
  }

  // 切換是否在 3D 房間中投影自訂家具立體實體
  toggleCustomFurniture3D() {
    this.state.customFurniture.in3D = !this.state.customFurniture.in3D;
    const btn = document.getElementById('btn-toggle-furniture-3d');

    if (this.state.customFurniture.in3D) {
      this.viewer.addCustomFurnitureBox(this.state.customFurniture);
      if (btn) {
        btn.textContent = '✅ 已在 3D 空間中顯示 (點擊隱藏)';
        btn.className = 'px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 transition shadow-sm';
      }
      this.showToast('🛋️ 自訂尺寸家具已投影至 3D 空間！可切換 360° 或走進去檢視');
    } else {
      this.viewer.removeCustomFurniture();
      if (btn) {
        btn.textContent = '👀 在 3D 空間中投放此家具';
        btn.className = 'px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition shadow-sm';
      }
      this.showToast('已自 3D 空間移除該家具');
    }
  }

  // 下載合成效果圖
  downloadCompositeMockup() {
    const canvas = document.getElementById('furniture-floorplan-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `空間配比效果圖-${this.state.customFurniture.name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    this.showToast('📥 規劃效果圖下載完成！');
  }

  // 選擇地坪材質
  selectFloor(floorId) {
    const f = MaterialsData.floors.find(x => x.id === floorId);
    if (!f) return;
    this.state.floor = f;
    this.viewer.updateFloor(f);
    this.renderFloorOptions();
    this.renderBathroomStudio();
    this.updateAdviceAndProportions();
  }

  selectWallColor(hex) {
    this.state.wallImage = null;
    this.state.wallColor = hex;
    this.viewer.updateWallColor(hex);
    this.renderWallColorOptions();
    this.renderBathroomStudio();
    this.updateAdviceAndProportions();
  }

  selectWallItem(wallId) {
    const w = MaterialsData.wallColors.find(x => x.id === wallId);
    if (!w) return;
    if (w.image) {
      this.state.wallImage = w.image;
      this.state.wallColor = w.hex;
      this.viewer.updateWallColor(w);
    } else {
      this.state.wallImage = null;
      this.state.wallColor = w.hex;
      this.viewer.updateWallColor(w.hex);
    }
    this.renderWallColorOptions();
    this.renderBathroomStudio();
    this.updateAdviceAndProportions();
  }

  // 浴室專屬：實拍石板樣品地壁自由搭配台
  renderBathroomStudio() {
    const container = document.getElementById('bathroom-studio-container');
    if (!container) return;

    // 4 款廠商實拍樣品
    const vendorFloors = MaterialsData.floors.filter(f => f.id.startsWith('vendor_'));
    const vendorWalls = MaterialsData.wallColors.filter(w => w.id.startsWith('wall_vendor_') || w.id.includes('4132'));
    const derivedColors = MaterialsData.wallColors.filter(w => w.id.startsWith('color_'));

    container.innerHTML = `
      <!-- 1. 預設四款精選實拍套餐快捷切換 -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-stone-800">4 大實拍樣品搭配套餐:</span>
          <span class="text-[10px] text-amber-800">一鍵同步地坪+主牆+五金</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="window.app.applyBathroomMix('vendor_413277', 'wall_413277_tex', '#C8A365', '413277 暖沙象牙洞石 SPA 風')"
                  class="p-2 rounded-xl border border-stone-200 bg-white hover:border-amber-400 text-left transition shadow-xs flex items-center space-x-2">
            <img src="assets/tiles/413277_0.jpg" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="413277">
            <div class="min-w-0">
              <div class="text-[11px] font-bold text-stone-800 truncate">暖沙象牙洞石</div>
              <div class="text-[10px] text-stone-500 truncate">413277 + 黃銅金</div>
            </div>
          </button>
          <button onclick="window.app.applyBathroomMix('vendor_413278', 'wall_413278_tex', '#222224', '413278 微風灰綠石板侘寂風')"
                  class="p-2 rounded-xl border border-stone-200 bg-white hover:border-amber-400 text-left transition shadow-xs flex items-center space-x-2">
            <img src="assets/tiles/413278_0.jpg" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="413278">
            <div class="min-w-0">
              <div class="text-[11px] font-bold text-stone-800 truncate">微風灰綠石板</div>
              <div class="text-[10px] text-stone-500 truncate">413278 + 霧黑五金</div>
            </div>
          </button>
          <button onclick="window.app.applyBathroomMix('vendor_413281', 'wall_413281_tex', '#A29258', '413281 金砂黑曜玄武奢華風')"
                  class="p-2 rounded-xl border border-stone-200 bg-white hover:border-amber-400 text-left transition shadow-xs flex items-center space-x-2">
            <img src="assets/tiles/413281_0.jpg" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="413281">
            <div class="min-w-0">
              <div class="text-[11px] font-bold text-stone-800 truncate">金砂黑曜玄武</div>
              <div class="text-[10px] text-stone-500 truncate">413281 + 金砂黃金</div>
            </div>
          </button>
          <button onclick="window.app.applyBathroomMix('vendor_413282', 'wall_413282_tex', '#D8DCE0', '413282 暮光煙燻紫灰前衛風')"
                  class="p-2 rounded-xl border border-stone-200 bg-white hover:border-amber-400 text-left transition shadow-xs flex items-center space-x-2">
            <img src="assets/tiles/413282_0.jpg" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="413282">
            <div class="min-w-0">
              <div class="text-[11px] font-bold text-stone-800 truncate">暮光煙燻紫灰</div>
              <div class="text-[10px] text-stone-500 truncate">413282 + 拋光鉻銀</div>
            </div>
          </button>
        </div>
      </div>

      <!-- 2. 浴室地坪樣式自由挑選 -->
      <div class="space-y-1.5 pt-1 border-t border-amber-200/50">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-stone-800">1. 挑選浴室地板 (Floor Tile):</span>
          <span class="text-[10px] text-stone-500">當前: ${this.state.floor.name}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          ${vendorFloors.map(vf => `
            <div onclick="window.app.selectFloor('${vf.id}')"
                 class="p-2 rounded-xl border cursor-pointer transition ${vf.id === this.state.floor.id ? 'ring-2 ring-stone-900 bg-white shadow-sm' : 'border-stone-200 bg-white/70 hover:bg-white'}">
              <div class="h-12 w-full rounded-lg mb-1.5 shadow-inner" style="background-image: url('${vf.image}'); background-size: cover; background-position: center;"></div>
              <div class="text-[11px] font-bold text-stone-800 truncate">${vf.name.split(' (')[0]}</div>
              <div class="text-[10px] text-stone-500 font-mono">${vf.id.replace('vendor_', '#')}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 3. 浴室牆面樣式自由挑選 (實拍紋理 or 萃取純色) -->
      <div class="space-y-1.5 pt-1 border-t border-amber-200/50">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-stone-800">2. 挑選浴室牆面 (Wall Finish):</span>
          <span class="text-[10px] text-stone-500">可搭實拍紋理或純色微水泥</span>
        </div>
        <!-- 實拍石板牆紋 -->
        <div class="grid grid-cols-4 gap-1.5 mb-2">
          ${vendorWalls.map(vw => `
            <div onclick="window.app.selectWallItem('${vw.id}')"
                 class="p-1 rounded-lg border text-center cursor-pointer transition ${this.state.wallImage === vw.image ? 'ring-2 ring-stone-900 bg-white shadow-xs' : 'border-stone-200 bg-white/70 hover:bg-white'}" title="${vw.name}">
              <div class="h-8 w-full rounded shadow-inner mb-1" style="background-image: url('${vw.image}'); background-size: cover; background-position: center;"></div>
              <div class="text-[9px] font-bold text-stone-700 truncate">${vw.name.split(' ')[0]}</div>
            </div>
          `).join('')}
        </div>
        <!-- 萃取之衍生純色塗裝 -->
        <div class="flex flex-wrap gap-1.5">
          ${derivedColors.map(dc => `
            <div onclick="window.app.selectWallItem('${dc.id}')"
                 class="px-2 py-1 rounded-lg border flex items-center space-x-1.5 cursor-pointer transition ${this.state.wallColor.toLowerCase() === dc.hex.toLowerCase() && !this.state.wallImage ? 'ring-2 ring-stone-900 bg-white shadow-xs' : 'border-stone-200 bg-white/60 hover:bg-white'}">
              <span class="w-3.5 h-3.5 rounded-full shadow-inner border border-black/10" style="background-color: ${dc.hex};"></span>
              <span class="text-[10px] font-medium text-stone-700">${dc.name.split(' (')[0]}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 套用浴室搭配套餐
  applyBathroomMix(floorId, wallId, accentHex, recipeName) {
    if (this.state.spaceType !== 'bathroom') {
      this.switchSpace('bathroom');
    }
    this.selectFloor(floorId);
    this.selectWallItem(wallId);
    this.selectAccent(accentHex, true);
    this.showToast(`✨ 已成功套用「${recipeName}」！`);
  }

  selectSofa(hex) {
    this.state.sofaHex = hex;
    this.viewer.updateSofa(hex);
    this.renderSofaOptions();
    this.updateAdviceAndProportions();
  }

  selectAccent(hex, isMetal = false) {
    this.state.accentHex = hex;
    this.state.isAccentMetal = isMetal;
    this.viewer.updateAccent(hex, isMetal);
    this.renderAccentOptions();
    this.updateAdviceAndProportions();
  }

  applyPreset(presetId) {
    const p = MaterialsData.stylePresets.find(x => x.id === presetId);
    if (!p) return;

    if (p.spaceId && p.spaceId !== this.state.spaceType) {
      this.switchSpace(p.spaceId);
    }

    const floor = MaterialsData.floors.find(f => f.id === p.floorId) || MaterialsData.floors[0];
    this.state.floor = floor;
    this.state.wallColor = p.wallColor;
    this.state.sofaHex = p.sofaHex;
    this.state.accentHex = p.accentHex;
    this.state.timeOfDay = p.timeOfDay || 'day';

    this.viewer.updateFloor(floor);
    this.viewer.updateWallColor(p.wallColor);
    this.viewer.updateSofa(p.sofaHex);
    this.viewer.updateAccent(p.accentHex, true);
    this.viewer.updateTimeOfDay(p.timeOfDay || 'day');

    this.renderFloorOptions();
    this.renderWallColorOptions();
    this.renderSofaOptions();
    this.renderAccentOptions();
    this.updateTimeOfDayUI(p.timeOfDay || 'day');
    this.updateAdviceAndProportions();

    this.showToast(`✨ 已套用「${p.name}」風格配方！`);
  }

  setTimeOfDay(time) {
    this.state.timeOfDay = time;
    this.viewer.updateTimeOfDay(time);
    this.updateTimeOfDayUI(time);
    this.updateAdviceAndProportions();
  }

  updateTimeOfDayUI(time) {
    document.querySelectorAll('.time-btn').forEach(btn => {
      const match = btn.getAttribute('data-time') === time;
      btn.classList.toggle('bg-stone-900', match);
      btn.classList.toggle('text-white', match);
      btn.classList.toggle('bg-white', !match);
      btn.classList.toggle('text-stone-700', !match);
    });
  }

  setCameraMode(mode) {
    this.viewer.setMode(mode);
    const orbitBtn = document.getElementById('btn-mode-orbit');
    const walkinBtn = document.getElementById('btn-mode-walkin');
    const pad = document.getElementById('walk-control-pad');
    const hint = document.getElementById('view-mode-hint');

    if (mode === 'walkin') {
      walkinBtn.className = 'glass-pill px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white shadow-sm flex items-center space-x-1.5';
      orbitBtn.className = 'glass-pill px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/80 text-stone-700 hover:bg-white flex items-center space-x-1.5';
      if (pad) pad.classList.remove('hidden');
      if (hint) hint.textContent = '🚶 第一人稱漫遊中：使用 WASD / 鍵盤箭頭走動，按住滑鼠左鍵轉動視線';
      this.showToast('🚶 您已走入空間！使用 WASD 或方向按鈕漫遊探索');
    } else {
      orbitBtn.className = 'glass-pill px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white shadow-sm flex items-center space-x-1.5';
      walkinBtn.className = 'glass-pill px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/80 text-stone-700 hover:bg-white flex items-center space-x-1.5';
      if (pad) pad.classList.add('hidden');
      if (hint) hint.textContent = '🔄 360° 全景模式：按住滑鼠左鍵旋轉角度，滾輪縮放，右鍵平移';
    }
  }

  setCameraPreset(preset) {
    this.viewer.setCameraPreset(preset);
  }

  triggerWalkKey(key, isPressed) {
    if (this.viewer && this.viewer.walkState) {
      this.viewer.walkState.keys[key] = isPressed;
    }
  }

  updateAdviceAndProportions() {
    const analysis = AdviceEngine.analyzeConfiguration(this.state);

    const pingDisplay = document.getElementById('pings-display');
    const m2Display = document.getElementById('m2-display');
    if (pingDisplay) pingDisplay.textContent = `${this.state.pings} 坪`;
    if (m2Display) m2Display.textContent = `約 ${analysis.m2} m²`;

    const barBase = document.getElementById('ratio-bar-base');
    const barSec = document.getElementById('ratio-bar-secondary');
    const barAcc = document.getElementById('ratio-bar-accent');

    if (barBase) {
      barBase.style.backgroundColor = analysis.proportions.base.hex;
      barBase.title = `基底 60%: ${analysis.proportions.base.hex}`;
    }
    if (barSec) {
      barSec.style.backgroundColor = analysis.proportions.secondary.hex;
      barSec.title = `主體 30%: ${analysis.proportions.secondary.hex}`;
    }
    if (barAcc) {
      barAcc.style.backgroundColor = analysis.proportions.accent.hex;
      barAcc.title = `點綴 10%: ${analysis.proportions.accent.hex}`;
    }

    const scoreVal = document.getElementById('harmony-score-val');
    if (scoreVal) scoreVal.textContent = analysis.harmonyScore;

    const adviceList = document.getElementById('furniture-advice-list');
    if (adviceList) {
      adviceList.innerHTML = `
        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div class="flex items-center space-x-2 text-stone-800 font-semibold text-xs mb-1">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>核心主件與尺度</span>
          </div>
          <p class="text-[11px] text-stone-600 leading-relaxed">${analysis.furnitureAdvice.sofa}</p>
        </div>
        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div class="flex items-center space-x-2 text-stone-800 font-semibold text-xs mb-1">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>機能設備與照明配置</span>
          </div>
          <p class="text-[11px] text-stone-600 leading-relaxed">${analysis.furnitureAdvice.tv}</p>
        </div>
        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div class="flex items-center space-x-2 text-stone-800 font-semibold text-xs mb-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>安全動線與人體工學</span>
          </div>
          <p class="text-[11px] text-stone-600 leading-relaxed">${analysis.furnitureAdvice.walkway}</p>
        </div>
        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div class="flex items-center space-x-2 text-stone-800 font-semibold text-xs mb-1">
            <span class="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>收納細節與安全防護</span>
          </div>
          <p class="text-[11px] text-stone-600 leading-relaxed">${analysis.furnitureAdvice.coffeeTable}</p>
        </div>
      `;
    }

    const tipsContainer = document.getElementById('tips-container');
    if (tipsContainer) {
      let html = '';
      if (analysis.warnings.length > 0) {
        html += analysis.warnings.map(w => `
          <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div class="flex items-center space-x-1.5 text-amber-900 font-bold text-xs mb-1">
              <span>⚠️</span>
              <span>${w.title}</span>
            </div>
            <p class="text-[11px] text-amber-800 leading-relaxed">${w.desc}</p>
          </div>
        `).join('');
      }

      html += analysis.tips.map(t => `
        <div class="p-3 bg-white border border-stone-200 rounded-xl">
          <div class="flex items-center space-x-1.5 text-stone-800 font-bold text-xs mb-1">
            <span>💡</span>
            <span>${t.title}</span>
          </div>
          <p class="text-[11px] text-stone-600 leading-relaxed">${t.desc}</p>
        </div>
      `).join('');

      tipsContainer.innerHTML = html;
    }

    const budgetContainer = document.getElementById('budget-breakdown-container');
    if (budgetContainer) {
      budgetContainer.innerHTML = analysis.budgetBreakdown.map(b => `
        <div class="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-0">
          <div class="text-stone-700 font-medium">${b.category}</div>
          <div class="font-bold text-stone-900">${b.ratio}%</div>
        </div>
      `).join('');
    }
  }

  bindControls() {
    const pingsSlider = document.getElementById('pings-slider');
    if (pingsSlider) {
      pingsSlider.addEventListener('input', (e) => {
        this.state.pings = parseInt(e.target.value);
        this.updateAdviceAndProportions();
      });
    }

    const wallPicker = document.getElementById('custom-wall-picker');
    if (wallPicker) {
      wallPicker.addEventListener('input', (e) => {
        this.selectWallColor(e.target.value);
      });
    }

    const sofaPicker = document.getElementById('custom-sofa-picker');
    if (sofaPicker) {
      sofaPicker.addEventListener('input', (e) => {
        this.selectSofa(e.target.value);
      });
    }

    const padKeys = ['w', 'a', 's', 'd', 'q', 'e'];
    padKeys.forEach(k => {
      const btn = document.getElementById(`pad-btn-${k}`);
      if (btn) {
        btn.addEventListener('mousedown', () => this.triggerWalkKey(k, true));
        btn.addEventListener('mouseup', () => this.triggerWalkKey(k, false));
        btn.addEventListener('mouseleave', () => this.triggerWalkKey(k, false));
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); this.triggerWalkKey(k, true); });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); this.triggerWalkKey(k, false); });
      }
    });
  }

  bindPhotoUploader() {
    const fileInput = document.getElementById('room-photo-input');
    const dropZone = document.getElementById('photo-drop-zone');
    if (!fileInput || !dropZone) return;

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-stone-800', 'bg-stone-50');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-stone-800', 'bg-stone-50');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-stone-800', 'bg-stone-50');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.processPhoto(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.processPhoto(e.target.files[0]);
      }
    });
  }

  processPhoto(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const preview = document.getElementById('photo-preview');
        const previewImg = document.getElementById('photo-preview-img');
        const uploadPrompt = document.getElementById('photo-upload-prompt');
        if (preview && previewImg && uploadPrompt) {
          previewImg.src = img.src;
          preview.classList.remove('hidden');
          uploadPrompt.classList.add('hidden');
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);

        const imgData = ctx.getImageData(0, 0, 100, 100).data;
        const colorCounts = {};

        for (let i = 0; i < imgData.length; i += 16) {
          const r = Math.round(imgData[i] / 32) * 32;
          const g = Math.round(imgData[i+1] / 32) * 32;
          const b = Math.round(imgData[i+2] / 32) * 32;
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sorted = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]).slice(0, 5);
        this.state.extractedColors = sorted;
        this.renderExtractedColors(sorted);
        this.showToast('📸 照片色彩萃取完成！點擊色票可立即套用至房間');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  renderExtractedColors(colors) {
    const container = document.getElementById('extracted-colors-container');
    if (!container) return;

    container.innerHTML = `
      <div class="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-stone-800">照片採樣主色盤:</span>
          <button onclick="window.app.applyExtractedToRoom()" class="text-[11px] px-2 py-0.5 bg-stone-900 text-white rounded-md font-medium hover:bg-stone-800 transition">一鍵套用至3D</button>
        </div>
        <div class="flex items-center space-x-2">
          ${colors.map((c) => `
            <div class="flex-1 text-center cursor-pointer group" onclick="window.app.selectWallColor('${c}')" title="點擊設為主牆色">
              <div class="w-full h-8 rounded-lg shadow-inner mb-1 border border-black/10 group-hover:scale-105 transition" style="background:${c}"></div>
              <span class="text-[9px] font-mono text-stone-600 uppercase">${c}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  applyExtractedToRoom() {
    if (!this.state.extractedColors || this.state.extractedColors.length < 2) return;
    const [c1, c2, c3] = this.state.extractedColors;
    if (c1) this.selectWallColor(c1);
    if (c2) this.selectSofa(c2);
    if (c3) this.selectAccent(c3);
    this.showToast('🎨 已成功將照片主色調套用至 3D 空間！');
  }

  openVideoModal(youtubeId, title, summary) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('youtube-player-iframe');
    const titleEl = document.getElementById('video-modal-title');
    const descEl = document.getElementById('video-modal-desc');
    const linkEl = document.getElementById('video-external-link');

    if (!modal) return;
    titleEl.textContent = title;
    descEl.textContent = summary;
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    linkEl.href = `https://www.youtube.com/watch?v=${youtubeId}`;

    modal.classList.remove('hidden');
  }

  closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('youtube-player-iframe');
    if (modal) modal.classList.add('hidden');
    if (iframe) iframe.src = '';
  }

  openAIPromptModal() {
    const modal = document.getElementById('ai-modal');
    if (!modal) return;

    const { promptEn, promptZh } = AdviceEngine.generateAIPrompts(this.state);
    document.getElementById('ai-prompt-en').value = promptEn;
    document.getElementById('ai-prompt-zh').value = promptZh;

    modal.classList.remove('hidden');
  }

  closeAIPromptModal() {
    const modal = document.getElementById('ai-modal');
    if (modal) modal.classList.add('hidden');
  }

  copyPrompt(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.select();
    navigator.clipboard.writeText(el.value).then(() => {
      this.showToast('📋 提示詞已複製至剪貼簿！');
    });
  }

  exportDesignReport() {
    window.print();
  }

  showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 3000);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
