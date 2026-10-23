/**
 * 3D Scene Architecture & Multi-Space Rendering Engine for RoomCraft 3D
 * Generates 11 distinct custom 3D spatial environments (Living, Bedroom, Master Bedroom, Kids,
 * Elderly, Kitchen, Courtyard, Back Garden, BBQ Area, Campervan, Window Display).
 */

class RoomViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.orbitControls = null;

    // 目前空間類型: 'living', 'bedroom', 'master_bedroom', 'kids_room', 'elderly_room',
    // 'kitchen', 'courtyard', 'back_garden', 'bbq_area', 'campervan', 'window_display'
    this.spaceType = 'living';
    this.mode = 'orbit'; // 'orbit' or 'walkin'

    // 第一人稱漫遊狀態
    this.walkState = {
      x: 0,
      y: 1.65,
      z: 2.2,
      pitch: 0,
      yaw: 0,
      moveSpeed: 0.08,
      turnSpeed: 0.03,
      keys: { w: false, a: false, s: false, d: false, q: false, e: false },
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0
    };

    // 參照物件
    this.materials = {};
    this.meshes = {};
    this.lights = {};
    this.furnitureGroup = null;
    this.roomGroup = null;

    // 空間尺寸
    this.roomDims = { width: 6.4, depth: 6.0, height: 2.85 };

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xF0EFEA);

    this.camera = new THREE.PerspectiveCamera(55, this.width / this.height, 0.1, 100);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.06;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.02;
    this.orbitControls.minDistance = 1.8;
    this.orbitControls.maxDistance = 18.0;

    this.setupLighting();
    this.rebuildSpace('living');
    this.bindEvents();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    this.lights.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xE0D8C8, 0.7);
    this.scene.add(this.lights.hemiLight);

    this.lights.sunLight = new THREE.DirectionalLight(0xFFF6E5, 1.25);
    this.lights.sunLight.position.set(-8, 6, -1);
    this.lights.sunLight.castShadow = true;
    this.lights.sunLight.shadow.mapSize.width = 2048;
    this.lights.sunLight.shadow.mapSize.height = 2048;
    this.lights.sunLight.shadow.camera.near = 0.5;
    this.lights.sunLight.shadow.camera.far = 30;
    this.lights.sunLight.shadow.camera.left = -7;
    this.lights.sunLight.shadow.camera.right = 7;
    this.lights.sunLight.shadow.camera.top = 6;
    this.lights.sunLight.shadow.camera.bottom = -6;
    this.lights.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.lights.sunLight);

    this.lights.ambientFill = new THREE.PointLight(0xFFEEDD, 0.45, 14);
    this.lights.ambientFill.position.set(0, 2.5, 0);
    this.scene.add(this.lights.ambientFill);

    this.lights.accentLight = new THREE.PointLight(0xFFD39B, 0.85, 5);
    this.lights.accentLight.position.set(-2, 1.8, -1.2);
    this.lights.accentLight.castShadow = true;
    this.scene.add(this.lights.accentLight);
  }

  // 重建整個空間 (切換空間時調用)
  rebuildSpace(spaceType) {
    this.spaceType = spaceType;

    // 清除既有幾何
    if (this.roomGroup) this.scene.remove(this.roomGroup);
    if (this.furnitureGroup) this.scene.remove(this.furnitureGroup);

    this.roomGroup = new THREE.Group();
    this.furnitureGroup = new THREE.Group();
    this.scene.add(this.roomGroup);
    this.scene.add(this.furnitureGroup);

    // 根據空間設定尺寸與視角
    const isOutdoor = ['courtyard', 'back_garden', 'bbq_area'].includes(spaceType);
    const isCamper = spaceType === 'campervan';
    const isWindow = spaceType === 'window_display';
    const isBath = spaceType === 'bathroom';

    if (isOutdoor) {
      this.roomDims = { width: 8.0, depth: 7.5, height: 3.2 };
    } else if (isCamper) {
      this.roomDims = { width: 3.8, depth: 5.2, height: 2.2 };
    } else if (isWindow) {
      this.roomDims = { width: 4.8, depth: 3.8, height: 3.0 };
    } else if (isBath) {
      this.roomDims = { width: 4.8, depth: 4.2, height: 2.75 };
    } else {
      this.roomDims = { width: 6.4, depth: 6.0, height: 2.85 };
    }

    // 建構外殼與家具
    this.buildShellBySpace(spaceType);
    this.buildFurnitureBySpace(spaceType);

    // 重設預設相機位置
    this.setCameraPreset('perspective');
  }

  buildShellBySpace(spaceType) {
    const { width, depth, height } = this.roomDims;
    const halfW = width / 2;
    const halfD = depth / 2;
    const isOutdoor = ['courtyard', 'back_garden', 'bbq_area'].includes(spaceType);
    const isCamper = spaceType === 'campervan';
    const isWindow = spaceType === 'window_display';

    // 1. 地板 (Floor)
    const floorGeo = new THREE.PlaneGeometry(width, depth);
    const defaultFloorTex = ProceduralTextures.createOakTexture('#D2B99B');
    this.materials.floor = new THREE.MeshStandardMaterial({
      map: defaultFloorTex,
      roughness: 0.5,
      metalness: 0.05
    });
    this.meshes.floor = new THREE.Mesh(floorGeo, this.materials.floor);
    this.meshes.floor.rotation.x = -Math.PI / 2;
    this.meshes.floor.receiveShadow = true;
    this.roomGroup.add(this.meshes.floor);

    // 2. 主牆面 (Back Wall)
    this.materials.backWall = new THREE.MeshStandardMaterial({ color: 0xF7F4EE, roughness: 0.85 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(width, height), this.materials.backWall);
    backWall.position.set(0, height / 2, -halfD);
    backWall.receiveShadow = true;
    this.meshes.backWall = backWall;
    this.roomGroup.add(backWall);

    // 3. 右牆面 (Right Wall)
    this.materials.sideWall = new THREE.MeshStandardMaterial({ color: 0xF2EFE9, roughness: 0.9 });
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(depth, height), this.materials.sideWall);
    rightWall.position.set(halfW, height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    this.roomGroup.add(rightWall);

    // 天花板與天空背景
    if (!isOutdoor) {
      const ceilingGeo = new THREE.PlaneGeometry(width, depth);
      const ceilingMat = new THREE.MeshStandardMaterial({
        color: isCamper ? 0xE8DFC9 : 0xFDFDFD,
        roughness: 0.9
      });
      const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.y = height;
      this.roomGroup.add(ceiling);

      // 左側採光大窗或櫥窗玻璃
      if (!isCamper) {
        this.buildWindowAndBackdrop(halfW, depth, height, isWindow);
      }
    } else {
      // 戶外環境：木圍籬與天空背板
      this.buildOutdoorEnclosure(width, depth, height);
    }
  }

  buildWindowAndBackdrop(halfW, depth, height, isWindowDisplay) {
    // 窗外景觀背景
    const skyGeo = new THREE.PlaneGeometry(16, 7);
    this.materials.sky = new THREE.MeshBasicMaterial({
      map: ProceduralTextures.createWindowViewTexture('day'),
      side: THREE.DoubleSide
    });
    const sky = new THREE.Mesh(skyGeo, this.materials.sky);
    sky.position.set(-halfW - 3.2, 2.5, 0);
    sky.rotation.y = Math.PI / 2;
    this.roomGroup.add(sky);

    // 玻璃
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xE8F4F8,
      transparent: true,
      opacity: isWindowDisplay ? 0.12 : 0.22,
      transmission: 0.9,
      roughness: 0.05
    });
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(depth - 0.4, height - 0.4), glassMat);
    glass.position.set(-halfW + 0.04, height / 2, 0);
    glass.rotation.y = Math.PI / 2;
    this.roomGroup.add(glass);
  }

  buildOutdoorEnclosure(width, depth, height) {
    const halfW = width / 2;
    const halfD = depth / 2;

    // 木質景觀隱私圍籬 (Fence)
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x8C6B4F, roughness: 0.85 });
    for (let x = -halfW; x < halfW; x += 0.22) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.2, 0.04), fenceMat);
      slat.position.set(x + 0.09, 1.1, -halfD + 0.05);
      slat.castShadow = true;
      slat.receiveShadow = true;
      this.roomGroup.add(slat);
    }

    // 綠意大自然背景
    const skyGeo = new THREE.PlaneGeometry(24, 10);
    this.materials.sky = new THREE.MeshBasicMaterial({
      map: ProceduralTextures.createWindowViewTexture('day'),
      side: THREE.DoubleSide
    });
    const sky = new THREE.Mesh(skyGeo, this.materials.sky);
    sky.position.set(0, 4.5, -halfD - 2.5);
    this.roomGroup.add(sky);
  }

  // 依空間種類建置專屬 3D 家具與陳列模型
  buildFurnitureBySpace(type) {
    // 共用軟裝材質
    this.materials.sofa = new THREE.MeshStandardMaterial({ color: 0xE2DBD0, roughness: 0.8 });
    this.materials.cushion = new THREE.MeshStandardMaterial({ color: 0xC8A365, roughness: 0.7 });
    this.materials.metalLeg = new THREE.MeshStandardMaterial({ color: 0xC8A365, metalness: 0.85, roughness: 0.25 });
    this.materials.wood = new THREE.MeshStandardMaterial({ color: 0xC5A88A, roughness: 0.5 });

    switch (type) {
      case 'living':
        this.buildLivingFurniture();
        break;
      case 'bedroom':
        this.buildBedroomFurniture(false);
        break;
      case 'master_bedroom':
        this.buildBedroomFurniture(true);
        break;
      case 'kids_room':
        this.buildKidsFurniture();
        break;
      case 'elderly_room':
        this.buildElderlyFurniture();
        break;
      case 'kitchen':
        this.buildKitchenFurniture();
        break;
      case 'bathroom':
        this.buildBathroomFurniture();
        break;
      case 'courtyard':
        this.buildCourtyardFurniture();
        break;
      case 'back_garden':
        this.buildBackGardenFurniture();
        break;
      case 'bbq_area':
        this.buildBBQFurniture();
        break;
      case 'campervan':
        this.buildCampervanFurniture();
        break;
      case 'window_display':
        this.buildWindowDisplayFurniture();
        break;
      default:
        this.buildLivingFurniture();
    }
  }

  // 1. 客廳家具
  buildLivingFurniture() {
    // 地毯
    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 2.6),
      new THREE.MeshStandardMaterial({ map: ProceduralTextures.createRugTexture('#E5E0D6'), roughness: 0.95 })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.005, -0.4);
    rug.receiveShadow = true;
    this.furnitureGroup.add(rug);

    // 沙發
    const sofaGroup = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.35, 0.95), this.materials.sofa);
    seat.position.set(0, 0.35, -1.7);
    seat.castShadow = true;
    sofaGroup.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.52, 0.28), this.materials.sofa);
    back.position.set(0, 0.72, -2.05);
    back.castShadow = true;
    sofaGroup.add(back);

    // 抱枕
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.14), this.materials.cushion);
    p1.position.set(-0.75, 0.65, -1.82);
    p1.rotation.y = 0.22;
    p1.castShadow = true;
    sofaGroup.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.14), this.materials.cushion);
    p2.position.set(0.75, 0.65, -1.82);
    p2.rotation.y = -0.22;
    p2.castShadow = true;
    sofaGroup.add(p2);

    this.furnitureGroup.add(sofaGroup);

    // 茶几
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.04, 32), new THREE.MeshStandardMaterial({ color: 0xECE5DA, roughness: 0.3 }));
    table.position.set(-0.25, 0.38, -0.45);
    table.castShadow = true;
    this.furnitureGroup.add(table);

    // 電視櫃與電視
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.28, 0.38), this.materials.wood);
    cabinet.position.set(0, 0.45, 2.5);
    cabinet.castShadow = true;
    this.furnitureGroup.add(cabinet);

    const tv = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.88, 0.04), new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.2 }));
    tv.position.set(0, 1.35, 2.75);
    this.furnitureGroup.add(tv);

    // 落地立燈
    this.addFloorLamp(-2.2, -1.2);
    // 盆栽
    this.addPlant(2.2, -2.1);
  }

  // 2. 臥室 / 主臥室家具
  buildBedroomFurniture(isMaster = false) {
    const bedW = isMaster ? 2.0 : 1.6;
    const bedL = 2.1;

    // 雙人床底座
    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(bedW, 0.3, bedL), this.materials.wood);
    bedBase.position.set(0, 0.15, -1.5);
    bedBase.castShadow = true;
    this.furnitureGroup.add(bedBase);

    // 舒適床墊
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(bedW - 0.05, 0.26, bedL - 0.05), new THREE.MeshStandardMaterial({ color: 0xFAF8F5, roughness: 0.9 }));
    mattress.position.set(0, 0.42, -1.5);
    mattress.castShadow = true;
    this.furnitureGroup.add(mattress);

    // 蓬鬆棉被 (Duvet)
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(bedW - 0.08, 0.16, 1.4), this.materials.sofa);
    duvet.position.set(0, 0.58, -1.15);
    duvet.castShadow = true;
    this.furnitureGroup.add(duvet);

    // 床頭枕頭 x2
    for (let i = -1; i <= 1; i += 2) {
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.14, 0.42), this.materials.cushion);
      pillow.position.set(i * (bedW * 0.25), 0.62, -2.15);
      pillow.rotation.x = 0.2;
      pillow.castShadow = true;
      this.furnitureGroup.add(pillow);
    }

    // 床頭板 (Headboard)
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(bedW + 0.3, 1.05, 0.1), this.materials.wood);
    headboard.position.set(0, 0.75, -2.55);
    headboard.castShadow = true;
    this.furnitureGroup.add(headboard);

    // 兩側床頭櫃與暖光小夜燈
    for (let side of [-1, 1]) {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.45, 0.42), this.materials.wood);
      stand.position.set(side * (bedW / 2 + 0.38), 0.225, -2.2);
      stand.castShadow = true;
      this.furnitureGroup.add(stand);

      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.24, 16), this.materials.metalLeg);
      lampBase.position.set(side * (bedW / 2 + 0.38), 0.57, -2.2);
      this.furnitureGroup.add(lampBase);

      const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.18, 16), new THREE.MeshBasicMaterial({ color: 0xFFF1D0 }));
      lampShade.position.set(side * (bedW / 2 + 0.38), 0.72, -2.2);
      this.furnitureGroup.add(lampShade);
    }

    // 主臥專屬：休閒閱讀單椅與立燈
    if (isMaster) {
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), this.materials.sofa);
      chair.position.set(2.1, 0.38, 0.8);
      chair.rotation.y = -0.6;
      chair.castShadow = true;
      this.furnitureGroup.add(chair);
      this.addFloorLamp(2.5, 0.4);
    }

    // 衣櫃
    const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.3, 0.58), new THREE.MeshStandardMaterial({ color: 0xF3EFEA, roughness: 0.6 }));
    wardrobe.position.set(-2.2, 1.15, 0.8);
    wardrobe.castShadow = true;
    this.furnitureGroup.add(wardrobe);
  }

  // 3. 小孩子的房間家具
  buildKidsFurniture() {
    // 兒童單人床
    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 2.0), this.materials.wood);
    bed.position.set(-1.8, 0.2, -1.6);
    bed.castShadow = true;
    this.furnitureGroup.add(bed);

    // 繽紛被套與星星抱枕
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.18, 1.3), this.materials.sofa);
    duvet.position.set(-1.8, 0.46, -1.25);
    this.furnitureGroup.add(duvet);

    const starPillow = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 5), this.materials.cushion);
    starPillow.position.set(-1.8, 0.52, -2.1);
    this.furnitureGroup.add(starPillow);

    // 護眼學習成長書桌與人體工學椅
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.72, 0.65), new THREE.MeshStandardMaterial({ color: 0xF7F5F0, roughness: 0.4 }));
    desk.position.set(1.6, 0.36, -2.0);
    desk.castShadow = true;
    this.furnitureGroup.add(desk);

    const deskChair = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.65, 0.45), this.materials.cushion);
    deskChair.position.set(1.6, 0.35, -1.3);
    deskChair.castShadow = true;
    this.furnitureGroup.add(deskChair);

    // 書桌護眼檯燈
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12), this.materials.metalLeg);
    lamp.position.set(1.2, 0.95, -2.0);
    this.furnitureGroup.add(lamp);

    // 開放式玩具收納方格櫃 (Toy Cubes)
    const toyBoxMat = new THREE.MeshStandardMaterial({ color: 0xD8E5E0, roughness: 0.6 });
    for (let c = 0; c < 3; c++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.4), toyBoxMat);
      box.position.set(-0.2 + c * 0.65, 0.25, 2.2);
      box.castShadow = true;
      this.furnitureGroup.add(box);
    }

    // 圓形遊戲安全跳色地毯
    const rug = new THREE.Mesh(
      new THREE.CircleGeometry(1.2, 32),
      new THREE.MeshStandardMaterial({ color: 0xF4E8C1, roughness: 0.9 })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.005, 0.2);
    this.furnitureGroup.add(rug);
  }

  // 4. 老人家房間 (孝親房)
  buildElderlyFurniture() {
    // 圓角防撞低床台 (離地 45cm 方便雙腳著地)
    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 2.05), new THREE.MeshStandardMaterial({ color: 0xB09072, roughness: 0.6 }));
    bed.position.set(-1.2, 0.225, -1.6);
    bed.castShadow = true;
    this.furnitureGroup.add(bed);

    // 床邊安全起身輔助扶手 (Safety Grab Bar)
    const railMat = new THREE.MeshStandardMaterial({ color: 0xDDD9D2, metalness: 0.6, roughness: 0.3 });
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 16), railMat);
    rail.position.set(-0.4, 0.65, -1.3);
    this.furnitureGroup.add(rail);

    // 舒適高靠背人體工學扶手單椅 (方便起身支撐)
    const armChair = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.88, 0.8), this.materials.sofa);
    armChair.position.set(1.8, 0.44, -1.4);
    armChair.castShadow = true;
    this.furnitureGroup.add(armChair);

    // 夜間 30cm 低位防眩感應走道燈
    const nightLight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.03), new THREE.MeshBasicMaterial({ color: 0xFFE0A0 }));
    nightLight.position.set(2.8, 0.3, 0);
    this.furnitureGroup.add(nightLight);

    // 暖心大衣櫃 (低拉籃無阻礙)
    const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.1, 0.55), new THREE.MeshStandardMaterial({ color: 0xE8E2D6, roughness: 0.6 }));
    wardrobe.position.set(1.6, 1.05, 1.8);
    this.furnitureGroup.add(wardrobe);
  }

  // 5. 現代廚房與料理中島
  buildKitchenFurniture() {
    // 核心大理石料理中島 (Kitchen Island)
    const island = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.9, 1.1),
      new THREE.MeshStandardMaterial({ map: ProceduralTextures.createMarbleTexture(), roughness: 0.2, metalness: 0.1 })
    );
    island.position.set(0, 0.45, 0.2);
    island.castShadow = true;
    this.furnitureGroup.add(island);

    // 中島鵝頸不鏽鋼水龍頭與水槽
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.35, 16), this.materials.metalLeg);
    faucet.position.set(-0.6, 1.05, 0.2);
    this.furnitureGroup.add(faucet);

    // 高腳吧台椅 x2
    for (let i of [-0.6, 0.6]) {
      const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.68, 24), this.materials.sofa);
      stool.position.set(i, 0.34, 1.25);
      stool.castShadow = true;
      this.furnitureGroup.add(stool);
    }

    // 後方一字型廚具流理台與吊櫃
    const counter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.88, 0.65), new THREE.MeshStandardMaterial({ color: 0x33363B, roughness: 0.4 }));
    counter.position.set(0, 0.44, -2.4);
    counter.castShadow = true;
    this.furnitureGroup.add(counter);

    // 吊櫃
    const upperCabinet = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.75, 0.38), new THREE.MeshStandardMaterial({ color: 0xEAE5DC, roughness: 0.6 }));
    upperCabinet.position.set(0, 2.1, -2.5);
    this.furnitureGroup.add(upperCabinet);

    // 中島上方雙黃銅吊燈
    for (let lx of [-0.65, 0.65]) {
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.1, 8), this.materials.metalLeg);
      cord.position.set(lx, 2.3, 0.2);
      this.furnitureGroup.add(cord);

      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.16, 16), this.materials.metalLeg);
      shade.position.set(lx, 1.75, 0.2);
      this.furnitureGroup.add(shade);
    }
  }

  // 6. 陽光庭院 (Courtyard / Patio)
  buildCourtyardFurniture() {
    // 戶外現代休閒沙發/躺椅
    const outdoorSofa = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 0.85), this.materials.sofa);
    outdoorSofa.position.set(0, 0.25, -1.2);
    outdoorSofa.castShadow = true;
    this.furnitureGroup.add(outdoorSofa);

    // 戶外石材矮茶几
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.3, 24), new THREE.MeshStandardMaterial({ color: 0x6E6B65, roughness: 0.8 }));
    table.position.set(0, 0.15, 0.2);
    table.castShadow = true;
    this.furnitureGroup.add(table);

    // 大型遮陽傘 (Outdoor Umbrella)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.8, 16), this.materials.metalLeg);
    pole.position.set(-2.2, 1.4, -0.6);
    this.furnitureGroup.add(pole);

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.45, 16), new THREE.MeshStandardMaterial({ color: 0xFAF5EC, roughness: 0.7 }));
    canopy.position.set(-2.2, 2.8, -0.6);
    canopy.castShadow = true;
    this.furnitureGroup.add(canopy);

    // 兩座庭院大植栽 (橄欖樹 / 灌木盆栽)
    this.addPlant(2.6, -1.8);
    this.addPlant(-2.8, 1.8);
  }

  // 7. 後花園綠意天地 (Back Garden)
  buildBackGardenFurniture() {
    // 鋪設天然石板步道 (Stepping Stones)
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x8C887E, roughness: 0.85 });
    for (let z = -2.4; z <= 2.4; z += 1.1) {
      const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.04, 16), stoneMat);
      stone.position.set(Math.sin(z) * 0.3, 0.02, z);
      stone.receiveShadow = true;
      this.furnitureGroup.add(stone);
    }

    // 浪漫實木花園長凳
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.55), this.materials.wood);
    bench.position.set(2.2, 0.28, -1.4);
    bench.rotation.y = -0.4;
    bench.castShadow = true;
    this.furnitureGroup.add(bench);

    // 氛圍浪漫小吊燈串 (Fairy Lights)
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xFFEB99 });
    for (let x = -3.2; x <= 3.2; x += 0.8) {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), lightMat);
      bulb.position.set(x, 2.2 - Math.abs(x) * 0.06, -2.8);
      this.furnitureGroup.add(bulb);
    }

    this.addPlant(-2.4, -1.6);
  }

  // 8. 戶外 BBQ 聚會區
  buildBBQFurniture() {
    // 專業不鏽鋼燒烤台島 (BBQ Grill Station)
    const grill = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.95, 0.75), new THREE.MeshStandardMaterial({ color: 0x484B50, metalness: 0.8, roughness: 0.3 }));
    grill.position.set(0, 0.48, -2.2);
    grill.castShadow = true;
    this.furnitureGroup.add(grill);

    // 烤爐上掀金屬罩
    const grillHood = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.9, 16, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0x2A2C30, metalness: 0.9, roughness: 0.2 }));
    grillHood.rotation.z = Math.PI / 2;
    grillHood.position.set(0, 1.1, -2.2);
    this.furnitureGroup.add(grillHood);

    // 戶外厚實木長餐桌 (Picnic Dining Table)
    const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 1.0), this.materials.wood);
    table.position.set(0, 0.38, 0.8);
    table.castShadow = true;
    this.furnitureGroup.add(table);

    // 兩側長條木凳
    for (let s of [-0.85, 0.85]) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.44, 0.35), this.materials.wood);
      bench.position.set(0, 0.22, 0.8 + s);
      bench.castShadow = true;
      this.furnitureGroup.add(bench);
    }

    // 派對復古串燈
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
    for (let x = -2.5; x <= 2.5; x += 0.8) {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), lightMat);
      bulb.position.set(x, 2.4, 0.8);
      this.furnitureGroup.add(bulb);
    }
  }

  // 9. 露營車配置 (Campervan Vanlife)
  buildCampervanFurniture() {
    // 車尾多功能變形沙發床 (Convertible Bed/Bench)
    const bedBench = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 1.4), this.materials.sofa);
    bedBench.position.set(0, 0.25, -1.6);
    bedBench.castShadow = true;
    this.furnitureGroup.add(bedBench);

    // 抱枕
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.12), this.materials.cushion);
    p.position.set(0.6, 0.55, -2.0);
    this.furnitureGroup.add(p);

    // 微型料理台 (Mini Kitchenette with Sink)
    const miniKitchen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.85, 0.55), this.materials.wood);
    miniKitchen.position.set(-1.1, 0.42, 0.6);
    miniKitchen.castShadow = true;
    this.furnitureGroup.add(miniKitchen);

    // 車頂吊掛掀櫃 (Overhead Cabinets)
    const overhead = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.32, 0.38), this.materials.wood);
    overhead.position.set(0, 1.88, -1.8);
    this.furnitureGroup.add(overhead);

    // 車內暖光線性燈條 (Warm LED Strip)
    const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.02, 0.04), new THREE.MeshBasicMaterial({ color: 0xFFE6A3 }));
    ledStrip.position.set(0, 1.72, -1.6);
    this.furnitureGroup.add(ledStrip);
  }

  // 10. 精品櫥窗設計 (Window Display)
  buildWindowDisplayFurniture() {
    // 多層次幾何展陳台柱 (Pedestal Podiums)
    const pMat1 = new THREE.MeshStandardMaterial({ map: ProceduralTextures.createMarbleTexture(), roughness: 0.2 });
    const pMat2 = new THREE.MeshStandardMaterial({ color: 0xC8A365, metalness: 0.85, roughness: 0.2 });

    // 主中央展台
    const podiumMain = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.7, 32), pMat1);
    podiumMain.position.set(0, 0.35, -0.4);
    podiumMain.castShadow = true;
    this.furnitureGroup.add(podiumMain);

    // 側邊副展台
    const podiumSub = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.65), pMat2);
    podiumSub.position.set(1.2, 0.225, 0.3);
    podiumSub.castShadow = true;
    this.furnitureGroup.add(podiumSub);

    // 展台上精品花藝 / 雕塑象徵物
    const sculpture = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 16, 32), pMat2);
    sculpture.position.set(0, 0.95, -0.4);
    sculpture.castShadow = true;
    this.furnitureGroup.add(sculpture);

    // 模特兒剪影立台
    const mannequin = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 1.4, 16), new THREE.MeshStandardMaterial({ color: 0x1E1E1E, roughness: 0.6 }));
    mannequin.position.set(-1.1, 0.8, -0.2);
    mannequin.castShadow = true;
    this.furnitureGroup.add(mannequin);

    // 頂部高角度磁吸聚光投射燈
    const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.25, 16), this.materials.metalLeg);
    spot.position.set(0, 2.7, 0.5);
    spot.rotation.x = 0.5;
    this.furnitureGroup.add(spot);
  }

  // 11. 風格衛浴空間 (Bathroom)
  buildBathroomFurniture() {
    // 1. 獨立蛋形現代浴缸 (Freestanding Bathtub)
    const tubGroup = new THREE.Group();
    const tubMat = new THREE.MeshStandardMaterial({ color: 0xFCFCFC, roughness: 0.15, metalness: 0.05 });
    const tubOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.58, 32), tubMat);
    tubOuter.scale.set(1.45, 1, 0.95);
    tubOuter.position.set(-1.1, 0.29, -0.9);
    tubOuter.castShadow = true;
    tubGroup.add(tubOuter);

    // 落地型浴缸立式水龍頭
    const tubFaucet = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.95, 16), this.materials.metalLeg);
    tubFaucet.position.set(-1.1, 0.475, -1.65);
    tubGroup.add(tubFaucet);

    const tubSpout = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.25), this.materials.metalLeg);
    tubSpout.position.set(-1.1, 0.92, -1.55);
    tubGroup.add(tubSpout);
    this.furnitureGroup.add(tubGroup);

    // 2. 乾濕分離淋浴區 (Glass Shower Screen & Rain Shower)
    const showerGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xE8F4F8,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      transmission: 0.9
    });
    const glassScreen = new THREE.Mesh(new THREE.BoxGeometry(0.02, 2.1, 1.4), showerGlassMat);
    glassScreen.position.set(0.4, 1.05, -1.3);
    glassScreen.castShadow = true;
    this.furnitureGroup.add(glassScreen);

    // 頂部大花灑與水龍頭
    const showerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4, 8), this.materials.metalLeg);
    showerArm.rotation.x = Math.PI / 2;
    showerArm.position.set(1.2, 2.3, -1.9);
    this.furnitureGroup.add(showerArm);

    const showerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 24), this.materials.metalLeg);
    showerHead.position.set(1.2, 2.15, -1.7);
    this.furnitureGroup.add(showerHead);

    // 3. 懸空大理石浴櫃與洗臉盆 (Floating Vanity)
    const vanityGroup = new THREE.Group();
    const vanityMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextures.createMarbleTexture(),
      roughness: 0.25
    });
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.55), vanityMat);
    vanity.position.set(-0.8, 0.65, 1.4);
    vanity.castShadow = true;
    vanityGroup.add(vanity);

    // 陶瓷面盆
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.14, 24), new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1 }));
    basin.position.set(-0.8, 0.89, 1.4);
    vanityGroup.add(basin);

    // 鵝頸龍頭
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.26, 16), this.materials.metalLeg);
    faucet.position.set(-0.8, 1.05, 1.55);
    vanityGroup.add(faucet);

    // 智能防霧背光 LED 浴室鏡
    const mirror = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.02, 32),
      new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.05, metalness: 0.95 })
    );
    mirror.rotation.x = Math.PI / 2;
    mirror.position.set(-0.8, 1.65, 1.95);
    vanityGroup.add(mirror);

    const mirrorGlow = new THREE.Mesh(
      new THREE.RingGeometry(0.44, 0.48, 32),
      new THREE.MeshBasicMaterial({ color: 0xFFE6A8, side: THREE.DoubleSide })
    );
    mirrorGlow.position.set(-0.8, 1.65, 1.93);
    vanityGroup.add(mirrorGlow);
    this.furnitureGroup.add(vanityGroup);

    // 4. 壁掛智能馬桶 (Wall-hung Smart Toilet)
    const toiletGroup = new THREE.Group();
    const toiletMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });
    const bowl = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.62), toiletMat);
    bowl.position.set(1.4, 0.42, 1.3);
    bowl.castShadow = true;
    toiletGroup.add(bowl);

    // 隱藏水箱假牆與沖水面板
    const wallUnit = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.15, 0.22), this.materials.wood);
    wallUnit.position.set(1.4, 0.575, 1.8);
    toiletGroup.add(wallUnit);

    const flushPlate = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.01), this.materials.metalLeg);
    flushPlate.position.set(1.4, 1.0, 1.68);
    toiletGroup.add(flushPlate);
    this.furnitureGroup.add(toiletGroup);

    // 5. 消光黑/黃銅電熱毛巾架 (Heated Towel Rack)
    const rackGroup = new THREE.Group();
    for (let h = 0; h < 4; h++) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.65, 16), this.materials.metalLeg);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(1.95, 1.1 + h * 0.16, 0.2);
      rackGroup.add(bar);
    }
    this.furnitureGroup.add(rackGroup);
  }

  // 輔助家具：落地燈
  addFloorLamp(x, z) {
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.7, 16), this.materials.metalLeg);
    lampStem.position.set(x, 0.85, z);
    lampStem.castShadow = true;
    this.furnitureGroup.add(lampStem);

    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.28, 24, 1, true), this.materials.metalLeg);
    lampShade.position.set(x, 1.65, z);
    this.furnitureGroup.add(lampShade);
  }

  // 輔助家具：綠植盆栽
  addPlant(x, z) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.45, 24), new THREE.MeshStandardMaterial({ color: 0xF3EFEA, roughness: 0.8 }));
    pot.position.set(x, 0.225, z);
    pot.castShadow = true;
    this.furnitureGroup.add(pot);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 8), new THREE.MeshStandardMaterial({ color: 0x4B3B2B, roughness: 0.9 }));
    stem.position.set(x, 0.8, z);
    this.furnitureGroup.add(stem);

    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2A5E35, roughness: 0.35, side: THREE.DoubleSide });
    for (let l = 0; l < 8; l++) {
      const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.48), leafMat);
      leaf.position.set(x + Math.cos(l * 0.8) * 0.2, 0.7 + l * 0.1, z + Math.sin(l * 0.8) * 0.2);
      leaf.rotation.set(0.6 + Math.random() * 0.4, l * 0.8, 0.3);
      leaf.castShadow = true;
      this.furnitureGroup.add(leaf);
    }
  }

  setCameraPreset(preset) {
    if (this.mode === 'walkin') {
      this.setMode('orbit');
    }

    if (preset === 'perspective') {
      this.camera.position.set(3.8, 2.6, 4.4);
      if (this.orbitControls) this.orbitControls.target.set(0, 0.9, -0.4);
    } else if (preset === 'front') {
      this.camera.position.set(0, 1.45, 3.8);
      if (this.orbitControls) this.orbitControls.target.set(0, 0.9, -1.0);
    } else if (preset === 'bird') {
      this.camera.position.set(0.2, 6.2, 0.8);
      if (this.orbitControls) this.orbitControls.target.set(0, 0, 0);
    } else if (preset === 'window') {
      this.camera.position.set(-2.5, 1.5, 2.8);
      if (this.orbitControls) this.orbitControls.target.set(0.5, 1.0, -1.2);
    }
  }

  setMode(newMode) {
    this.mode = newMode;
    if (newMode === 'walkin') {
      this.orbitControls.enabled = false;
      this.camera.position.set(this.walkState.x, this.walkState.y, this.walkState.z);
      this.updateWalkinCamera();
    } else {
      this.orbitControls.enabled = true;
      this.setCameraPreset('perspective');
    }
  }

  updateWalkinCamera() {
    this.camera.position.set(this.walkState.x, this.walkState.y, this.walkState.z);
    const target = new THREE.Vector3(
      this.walkState.x + Math.sin(this.walkState.yaw) * Math.cos(this.walkState.pitch),
      this.walkState.y + Math.sin(this.walkState.pitch),
      this.walkState.z - Math.cos(this.walkState.yaw) * Math.cos(this.walkState.pitch)
    );
    this.camera.lookAt(target);
  }

  updateWalkMovement() {
    if (this.mode !== 'walkin') return;

    const { keys, moveSpeed, turnSpeed } = this.walkState;
    const forward = new THREE.Vector3(Math.sin(this.walkState.yaw), 0, -Math.cos(this.walkState.yaw));
    const right = new THREE.Vector3(Math.cos(this.walkState.yaw), 0, Math.sin(this.walkState.yaw));

    if (keys.w) {
      this.walkState.x += forward.x * moveSpeed;
      this.walkState.z += forward.z * moveSpeed;
    }
    if (keys.s) {
      this.walkState.x -= forward.x * moveSpeed;
      this.walkState.z -= forward.z * moveSpeed;
    }
    if (keys.a) {
      this.walkState.x -= right.x * moveSpeed;
      this.walkState.z -= right.z * moveSpeed;
    }
    if (keys.d) {
      this.walkState.x += right.x * moveSpeed;
      this.walkState.z += right.z * moveSpeed;
    }
    if (keys.q) {
      this.walkState.yaw += turnSpeed;
    }
    if (keys.e) {
      this.walkState.yaw -= turnSpeed;
    }

    const boundX = this.roomDims.width / 2 - 0.45;
    const boundZ = this.roomDims.depth / 2 - 0.45;
    this.walkState.x = Math.max(-boundX, Math.min(boundX, this.walkState.x));
    this.walkState.z = Math.max(-boundZ, Math.min(boundZ, this.walkState.z));

    this.updateWalkinCamera();
  }

  updateFloor(floorData) {
    if (floorData.image) {
      this.applyCustomTexture('floor', floorData.image);
      return;
    }

    let tex;
    if (floorData.type === 'oak') {
      tex = ProceduralTextures.createOakTexture(floorData.color);
    } else if (floorData.type === 'herringbone') {
      tex = ProceduralTextures.createHerringboneTexture(floorData.color);
    } else if (floorData.type === 'marble') {
      tex = ProceduralTextures.createMarbleTexture(floorData.color);
    } else if (floorData.type === 'cement') {
      tex = ProceduralTextures.createCementTexture(floorData.color);
    } else if (floorData.type === 'terrazzo') {
      tex = ProceduralTextures.createTerrazzoTexture(floorData.color);
    } else {
      tex = ProceduralTextures.createOakTexture(floorData.color);
    }

    if (this.materials.floor) {
      this.materials.floor.map = tex;
      this.materials.floor.roughness = floorData.roughness || 0.45;
      this.materials.floor.metalness = floorData.metalness || 0.05;
      this.materials.floor.needsUpdate = true;
    }
  }

  updateWallColor(colorOrData) {
    if (typeof colorOrData === 'object' && colorOrData.image) {
      this.applyCustomTexture('wall', colorOrData.image);
      return;
    }

    const hex = typeof colorOrData === 'string' ? colorOrData : (colorOrData.hex || colorOrData.color);
    if (hex && hex.startsWith('#')) {
      if (this.materials.backWall) {
        this.materials.backWall.map = null;
        this.materials.backWall.color.set(hex);
        this.materials.backWall.needsUpdate = true;
      }
    } else if (typeof colorOrData === 'string') {
      this.applyCustomTexture('wall', colorOrData);
    }
  }

  updateSofa(hex) {
    if (this.materials.sofa) {
      const tex = ProceduralTextures.createFabricTexture(hex);
      this.materials.sofa.map = tex;
      this.materials.sofa.color.set(hex);
      this.materials.sofa.needsUpdate = true;
    }
  }

  updateAccent(hex, isMetal = false) {
    if (this.materials.cushion) {
      this.materials.cushion.color.set(hex);
      this.materials.cushion.needsUpdate = true;
    }
    if (isMetal && this.materials.metalLeg) {
      this.materials.metalLeg.color.set(hex);
      this.materials.metalLeg.needsUpdate = true;
    }
  }

  // 套用廠商提供的自訂照片紋理到 3D 地板、牆面或家具
  applyCustomTexture(target, imgUrl) {
    const loader = new THREE.TextureLoader();
    loader.load(imgUrl, (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.encoding = THREE.sRGBEncoding;

      if (target === 'floor') {
        tex.repeat.set(3, 3);
        if (this.materials.floor) {
          this.materials.floor.map = tex;
          this.materials.floor.roughness = 0.45;
          this.materials.floor.needsUpdate = true;
        }
      } else if (target === 'wall') {
        tex.repeat.set(2, 2);
        if (this.materials.backWall) {
          this.materials.backWall.map = tex;
          this.materials.backWall.needsUpdate = true;
        }
      } else if (target === 'sofa') {
        tex.repeat.set(3, 3);
        if (this.materials.sofa) {
          this.materials.sofa.map = tex;
          this.materials.sofa.needsUpdate = true;
        }
      }
    });
  }

  // 在 3D 空間中以真實公分尺寸放置使用者上傳的照片家具
  addCustomFurnitureBox(item) {
    if (this.customFurnitureMesh) {
      this.furnitureGroup.remove(this.customFurnitureMesh);
      this.customFurnitureMesh = null;
    }

    const { name, lengthCm, widthCm, heightCm, photoUrl } = item;
    const w = (lengthCm || 200) / 100;
    const h = (heightCm || 80) / 100;
    const d = (widthCm || 90) / 100;

    const group = new THREE.Group();
    const geo = new THREE.BoxGeometry(w, h, d);

    const loader = new THREE.TextureLoader();
    loader.load(photoUrl, (tex) => {
      tex.encoding = THREE.sRGBEncoding;
      const faceMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 });
      const sideMat = new THREE.MeshStandardMaterial({ color: 0xDCD5CA, roughness: 0.7 });
      const mats = [sideMat, sideMat, sideMat, sideMat, faceMat, sideMat];

      const mesh = new THREE.Mesh(geo, mats);
      mesh.position.set(0, h / 2, -0.2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      const labelPole = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.35, 8), this.materials.metalLeg);
      labelPole.position.set(0, h + 0.175, -0.2);
      group.add(labelPole);

      const labelBadge = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshBasicMaterial({ color: 0xF59E0B }));
      labelBadge.position.set(0, h + 0.35, -0.2);
      group.add(labelBadge);
    });

    this.customFurnitureMesh = group;
    this.furnitureGroup.add(group);
  }

  removeCustomFurniture() {
    if (this.customFurnitureMesh) {
      this.furnitureGroup.remove(this.customFurnitureMesh);
      this.customFurnitureMesh = null;
    }
  }

  updateTimeOfDay(time) {
    if (time === 'day') {
      this.scene.background.set(0xF2F5F8);
      this.lights.hemiLight.color.set(0xFFFFFF);
      this.lights.hemiLight.intensity = 0.7;
      this.lights.sunLight.color.set(0xFFF7E6);
      this.lights.sunLight.intensity = 1.35;
      this.lights.sunLight.position.set(-8, 6, -1);
      this.lights.ambientFill.intensity = 0.35;
      this.lights.accentLight.intensity = 0.2;
      if (this.materials.sky) this.materials.sky.map = ProceduralTextures.createWindowViewTexture('day');
    } else if (time === 'sunset') {
      this.scene.background.set(0xEBD7CA);
      this.lights.hemiLight.color.set(0xFCD8B8);
      this.lights.hemiLight.intensity = 0.55;
      this.lights.sunLight.color.set(0xFFA552);
      this.lights.sunLight.intensity = 1.6;
      this.lights.sunLight.position.set(-8, 3.2, -1);
      this.lights.ambientFill.intensity = 0.45;
      this.lights.accentLight.intensity = 0.65;
      if (this.materials.sky) this.materials.sky.map = ProceduralTextures.createWindowViewTexture('sunset');
    } else if (time === 'night') {
      this.scene.background.set(0x111625);
      this.lights.hemiLight.color.set(0x202B42);
      this.lights.hemiLight.intensity = 0.25;
      this.lights.sunLight.color.set(0x3B527E);
      this.lights.sunLight.intensity = 0.15;
      this.lights.ambientFill.color.set(0xFFD49B);
      this.lights.ambientFill.intensity = 0.85;
      this.lights.accentLight.color.set(0xFFA834);
      this.lights.accentLight.intensity = 1.45;
      if (this.materials.sky) this.materials.sky.map = ProceduralTextures.createWindowViewTexture('night');
    }
    if (this.materials.sky) this.materials.sky.needsUpdate = true;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });

    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.walkState.keys.w = true;
      if (k === 's' || k === 'arrowdown') this.walkState.keys.s = true;
      if (k === 'a' || k === 'arrowleft') this.walkState.keys.a = true;
      if (k === 'd' || k === 'arrowright') this.walkState.keys.d = true;
      if (k === 'q') this.walkState.keys.q = true;
      if (k === 'e') this.walkState.keys.e = true;
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.walkState.keys.w = false;
      if (k === 's' || k === 'arrowdown') this.walkState.keys.s = false;
      if (k === 'a' || k === 'arrowleft') this.walkState.keys.a = false;
      if (k === 'd' || k === 'arrowright') this.walkState.keys.d = false;
      if (k === 'q') this.walkState.keys.q = false;
      if (k === 'e') this.walkState.keys.e = false;
    });

    const dom = this.renderer.domElement;
    dom.addEventListener('mousedown', (e) => {
      if (this.mode === 'walkin' && e.button === 0) {
        this.walkState.isDragging = true;
        this.walkState.lastMouseX = e.clientX;
        this.walkState.lastMouseY = e.clientY;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.mode === 'walkin' && this.walkState.isDragging) {
        const dx = e.clientX - this.walkState.lastMouseX;
        const dy = e.clientY - this.walkState.lastMouseY;
        this.walkState.lastMouseX = e.clientX;
        this.walkState.lastMouseY = e.clientY;

        this.walkState.yaw -= dx * 0.005;
        this.walkState.pitch -= dy * 0.005;
        this.walkState.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.walkState.pitch));
        this.updateWalkinCamera();
      }
    });

    window.addEventListener('mouseup', () => {
      this.walkState.isDragging = false;
    });
  }

  animate() {
    requestAnimationFrame(this.animate);
    if (this.mode === 'walkin') {
      this.updateWalkMovement();
    } else {
      this.orbitControls.update();
    }
    this.renderer.render(this.scene, this.camera);
  }
}
