/**
 * Materials & Styling Database for RoomCraft 3D
 * Supports 11 distinct space types across residential, outdoor, campervan, and retail displays.
 */

const MaterialsData = {
  // 11 大空間定義與預設規格
  spaces: [
    {
      id: 'living',
      name: '客廳空間',
      category: 'residential',
      categoryName: '居室空間',
      icon: '🛋️',
      defaultPings: 10,
      minPings: 4,
      maxPings: 35,
      desc: '家庭核心聚會、影音娛樂與迎賓交誼場域',
      defaultFloor: 'oak_light',
      defaultWall: '#F7F4EE',
      furnitureFocus: '三人沙發、雙拼圓茶几、懸挑電視牆、羊毛地毯'
    },
    {
      id: 'bedroom',
      name: '舒適臥室',
      category: 'residential',
      categoryName: '居室空間',
      icon: '🛏️',
      defaultPings: 5,
      minPings: 3,
      maxPings: 12,
      desc: '舒眠休憩、個人沉澱與精巧衣物收納空間',
      defaultFloor: 'oak_light',
      defaultWall: '#F7F4EE',
      furnitureFocus: '標準雙人床、床頭暖光燈、衣櫃、多功能梳化工作桌'
    },
    {
      id: 'master_bedroom',
      name: '景觀主臥室',
      category: 'residential',
      categoryName: '居室空間',
      icon: '👑',
      defaultPings: 9,
      minPings: 6,
      maxPings: 20,
      desc: '套房級主臥，獨立更衣區、獨立梳妝台與私人閱讀單椅',
      defaultFloor: 'herringbone_oak',
      defaultWall: '#F8F6F1',
      furnitureFocus: 'King Size 雙人床、大氣木格柵床頭板、閱讀躺椅、落地採光窗'
    },
    {
      id: 'kids_room',
      name: '小孩子的房間',
      category: 'residential',
      categoryName: '居室空間',
      icon: '🧸',
      defaultPings: 4,
      minPings: 3,
      maxPings: 10,
      desc: '結合睡眠、學習、遊戲與成長彈性的童趣安全天地',
      defaultFloor: 'oak_light',
      defaultWall: '#EBF4F6', // 柔和天空藍/粉彩
      furnitureFocus: '兒童單人床、護眼成長書桌椅、開放式玩具收納櫃、繽紛遊戲地墊'
    },
    {
      id: 'elderly_room',
      name: '老人家房間 (孝親房)',
      category: 'residential',
      categoryName: '居室空間',
      icon: '👵',
      defaultPings: 6,
      minPings: 4,
      maxPings: 14,
      desc: '全齡通用無障礙、防滑、低床台、安全扶手與柔和防眩照明',
      defaultFloor: 'cork_soft',
      defaultWall: '#F4EFEB',
      furnitureFocus: '低重心穩固單人/雙人床、起身安全扶手、高靠背人體工學扶手椅、夜間低位感應燈'
    },
    {
      id: 'kitchen',
      name: '現代廚房與中島',
      category: 'residential',
      categoryName: '居室空間',
      icon: '🍳',
      defaultPings: 6,
      minPings: 3,
      maxPings: 16,
      desc: '黃金料理三角動線、社交型料理中島、高腳吧台與防濺好清潔材質',
      defaultFloor: 'calacatta_marble',
      defaultWall: '#F7F6F2',
      furnitureFocus: '大理石料理中島、高腳吧台椅、整合式懸吊系統櫃、嵌燈與防濺磁磚牆'
    },
    {
      id: 'bathroom',
      name: '風格衛浴空間',
      category: 'residential',
      categoryName: '居室空間',
      icon: '🛁',
      defaultPings: 2.5,
      minPings: 1,
      maxPings: 8,
      desc: '乾濕分離、獨立蛋形浴缸、玻璃淋浴花灑、懸空浴櫃、智能馬桶與防霧鏡櫃',
      defaultFloor: 'calacatta_marble',
      defaultWall: '#F7F6F2',
      furnitureFocus: '獨立蛋形浴缸、乾濕分離玻璃隔斷、懸空大理石面盆浴櫃、智能馬桶、防霧LED鏡'
    },
    {
      id: 'courtyard',
      name: '陽光庭院',
      category: 'outdoor',
      categoryName: '戶外休憩',
      icon: '🏡',
      defaultPings: 8,
      minPings: 3,
      maxPings: 25,
      desc: '戶外木棧平台、休閒躺椅、遮陽涼亭與四季常綠造景盆栽',
      defaultFloor: 'outdoor_teak',
      defaultWall: '#F0EEE9',
      furnitureFocus: '戶外柚木平台、遮陽涼亭傘、休閒編織躺椅、戶外植栽花槽'
    },
    {
      id: 'back_garden',
      name: '後花園綠意天地',
      category: 'outdoor',
      categoryName: '戶外休憩',
      icon: '🌿',
      defaultPings: 12,
      minPings: 5,
      maxPings: 35,
      desc: '天然草皮、石板步道、戶外長凳、圍籬花圃與浪漫氛圍燈串',
      defaultFloor: 'garden_grass',
      defaultWall: '#E8EFE9',
      furnitureFocus: '休閒實木長椅、石板步道踏石、景觀圍籬、花架花灌木'
    },
    {
      id: 'bbq_area',
      name: '戶外 BBQ 聚會區',
      category: 'outdoor',
      categoryName: '戶外休憩',
      icon: '🍖',
      defaultPings: 10,
      minPings: 4,
      maxPings: 30,
      desc: '不鏽鋼大型烤肉爐島台、戶外原木長餐桌長凳、備餐水槽與情境串燈',
      defaultFloor: 'outdoor_slate',
      defaultWall: '#DFDBD4',
      furnitureFocus: '專業烤肉燒烤島、戶外實木聚餐長桌、備料水槽吧台、派對復古串燈'
    },
    {
      id: 'campervan',
      name: '露營車配置 (Vanlife)',
      category: 'special',
      categoryName: '特色空間',
      icon: '🚐',
      defaultPings: 3,
      minPings: 2,
      maxPings: 6,
      desc: '極限微型坪數多機能化！折疊沙發床、微型廚房洗滌槽、頂部收納掀櫃',
      defaultFloor: 'camper_plywood',
      defaultWall: '#ECE5DB',
      furnitureFocus: '折疊多功能變形沙發床、微型流理台與水槽、車頂木格柵包覆、緊湊頂部收納櫃'
    },
    {
      id: 'window_display',
      name: '精緻櫥窗設計 (Display)',
      category: 'special',
      categoryName: '特色空間',
      icon: '✨',
      defaultPings: 3,
      minPings: 1,
      maxPings: 8,
      desc: '商業門市聚焦視覺！高低層次幾何展台、磁吸聚光軌道燈、品牌主視覺背景',
      defaultFloor: 'calacatta_marble',
      defaultWall: '#2B2E33', // 戲劇化深色背景
      furnitureFocus: '多層次陳列展台柱、人台剪影、磁吸高角度投射聚光燈、通透無框大玻璃'
    }
  ],

  // 豐富地板材質庫（涵蓋室內、防滑軟木、戶外防腐木、草皮、青石板、露營車夾板）
  floors: [
    {
      id: 'oak_light',
      name: '淺色白橡木地板',
      type: 'oak',
      color: '#D2B99B',
      roughness: 0.45,
      description: '北歐、日式無印首選，溫潤明亮，小坪數視覺膨脹感佳',
      tags: ['室內通鋪', '明亮自然', '居家必備']
    },
    {
      id: 'walnut_dark',
      name: '北美深黑胡桃木',
      type: 'walnut',
      color: '#5C4033',
      roughness: 0.4,
      description: '沉穩優雅、紋理細膩，適合主臥室、中古復古與現代都會',
      tags: ['沈穩大氣', '復古名作', '主臥推薦']
    },
    {
      id: 'herringbone_oak',
      name: '經典人字拼木地板',
      type: 'herringbone',
      color: '#C6A580',
      roughness: 0.42,
      description: '法式輕奢與北歐經典，幾何動態引導視覺縱深',
      tags: ['高級感', '法式復古', '主臥首選']
    },
    {
      id: 'calacatta_marble',
      name: '義大利魚肚白大理石',
      type: 'marble',
      color: '#F8F7F4',
      roughness: 0.18,
      metalness: 0.1,
      description: '天然灰金紋理，高反光透亮，適合現代廚房中島與精品櫥窗',
      tags: ['輕奢精品', '好清潔抗污', '廚房櫥窗']
    },
    {
      id: 'micro_cement',
      name: '無接縫微水泥地坪',
      type: 'cement',
      color: '#C2BEB6',
      roughness: 0.6,
      description: '極致一體連續面，質樸純粹，侘寂極簡的核心',
      tags: ['侘寂風', '無接縫', '低反光素雅']
    },
    {
      id: 'terrazzo_cream',
      name: '暖調水磨石地磚',
      type: 'terrazzo',
      color: '#ECE5DA',
      roughness: 0.35,
      description: '繽紛礦石碎片跳色，耐磨防刮，活潑中帶有復古韻味',
      tags: ['耐髒防潮', '廚房餐飲', '復古活力']
    },
    {
      id: 'cork_soft',
      name: '安心防滑軟木地板',
      type: 'oak',
      color: '#C8A882',
      roughness: 0.8,
      description: '觸感微彈緩衝防跌倒，保溫吸音，老人家孝親房與幼兒房守護者',
      tags: ['防滑緩衝', '孝親房首選', '溫熱不冰冷']
    },
    {
      id: 'outdoor_teak',
      name: '戶外耐候柚木棧板',
      type: 'oak',
      color: '#A06E42',
      roughness: 0.6,
      description: '含天然油脂防腐防潮，戶外庭院與陽台首選，營造渡假別墅感',
      tags: ['戶外耐候', '庭院甲板', '防滑耐曬']
    },
    {
      id: 'garden_grass',
      name: '庭園常綠草皮',
      type: 'cement',
      color: '#4B7B4B',
      roughness: 0.95,
      description: '綠意盎然的天然草坪，柔和自然光，後花園靈魂底色',
      tags: ['綠意盎然', '花園專用', '自然放鬆']
    },
    {
      id: 'outdoor_slate',
      name: '深灰青石板岩',
      type: 'cement',
      color: '#4A5056',
      roughness: 0.7,
      description: '天然岩石凹凸防滑質感，耐高溫、耐炭火油污，BBQ 烤肉區專用',
      tags: ['耐火抗污', 'BBQ專用', '粗獷自然']
    },
    {
      id: 'camper_plywood',
      name: '芬蘭樺木輕量夾板',
      type: 'oak',
      color: '#E4CFB2',
      roughness: 0.5,
      description: '高強度輕量化實木夾板，車載減重首選，呈現溫馨 Vanlife 風格',
      tags: ['輕量耐震', '露營車專用', '溫馨木作']
    },
    // 來自 lib 資料夾的實拍廠商石板樣品
    {
      id: 'vendor_413277',
      name: '暖沙象牙洞石板岩 (413277)',
      type: 'custom_image',
      image: 'assets/tiles/413277_0.jpg',
      color: '#D0CDC2',
      roughness: 0.35,
      description: '自然溫潤的暖沙米白石質，帶柔和象牙砂岩漸層，衛浴地壁通鋪星級放鬆感',
      tags: ['廠商實拍照', '衛浴推薦', '暖沙防滑']
    },
    {
      id: 'vendor_413278',
      name: '微風灰綠莫蘭迪石板 (413278)',
      type: 'custom_image',
      image: 'assets/tiles/413278_0.jpg',
      color: '#AFAFA8',
      roughness: 0.4,
      description: '帶沉靜礦物灰與微綠調的極簡板岩，防滑抗污，具備北歐日式自然石材的內斂質感',
      tags: ['廠商實拍照', '衛浴推薦', '灰綠石板']
    },
    {
      id: 'vendor_413281',
      name: '金砂黑曜玄武岩 (413281)',
      type: 'custom_image',
      image: 'assets/tiles/413281_0.jpg',
      color: '#444345',
      roughness: 0.45,
      description: '深邃高貴的玄武岩質地，蘊含微量金砂礦脈，搭配黃銅花灑五金與暖光燈條奢華感十足',
      tags: ['廠商實拍照', '衛浴推薦', '黑曜奢華']
    },
    {
      id: 'vendor_413282',
      name: '暮光煙燻紫灰石板 (413282)',
      type: 'custom_image',
      image: 'assets/tiles/413282_0.jpg',
      color: '#756F73',
      roughness: 0.42,
      description: '獨特低飽和紫灰與冷炭石紋融合，光影變化豐富，極具藝術個性與沉靜冥想氛圍',
      tags: ['廠商實拍照', '衛浴推薦', '煙燻紫灰']
    }
  ],

  // 牆面/背景色調
  wallColors: [
    { id: 'cream_white', name: '奶油暖白 (Oatmeal Cream)', hex: '#F7F4EE', desc: '百搭溫暖，小坪數空間膨脹感最佳' },
    { id: 'wall_413277_tex', name: '暖沙象牙洞石牆 (413277 紋理)', image: 'assets/tiles/413277_0.jpg', hex: '#D0CDC2', desc: '413277 廠商石板紋理映射主牆' },
    { id: 'wall_413278_tex', name: '微風灰綠石板牆 (413278 紋理)', image: 'assets/tiles/413278_0.jpg', hex: '#AFAFA8', desc: '413278 廠商石板紋理映射主牆' },
    { id: 'wall_413281_tex', name: '金砂黑曜玄武牆 (413281 紋理)', image: 'assets/tiles/413281_0.jpg', hex: '#444345', desc: '413281 廠商石板紋理映射主牆' },
    { id: 'wall_413282_tex', name: '暮光煙燻紫灰牆 (413282 紋理)', image: 'assets/tiles/413282_0.jpg', hex: '#756F73', desc: '413282 廠商石板紋理映射主牆' },
    { id: 'color_alabaster', name: '象牙柔砂白 (413277 純色)', hex: '#E0DED8', desc: '自 413277 萃取之極簡象牙柔白' },
    { id: 'color_sand_stone', name: '暖沙石灰 (413277 純色)', hex: '#D0CDC2', desc: '自 413277 萃取之溫潤暖沙色' },
    { id: 'color_sage_mineral', name: '莫蘭迪灰綠 (413278 純色)', hex: '#8B9584', desc: '自 413278 萃取之自然灰綠色' },
    { id: 'color_mist_grey', name: '微風清水灰 (413278 純色)', hex: '#AFAFA8', desc: '自 413278 萃取之微水泥霧灰色' },
    { id: 'color_noir_basalt', name: '玄武曜石黑 (413281 純色)', hex: '#353436', desc: '自 413281 萃取之都會深邃炭黑' },
    { id: 'color_gold_sand', name: '金砂微暖金 (413281 點綴)', hex: '#A29258', desc: '自 413281 萃取之天然微礦金' },
    { id: 'color_twilight_mauve', name: '煙燻暮光紫灰 (413282 純色)', hex: '#756F73', desc: '自 413282 萃取之藝術沉靜紫灰' },
    { id: 'sage_green', name: '莫蘭迪鼠尾草綠 (Sage Mist)', hex: '#9AA79B', desc: '沉靜大自然，舒緩眼部與心靈' },
    { id: 'smoky_blue', name: '煙燻霧藍 (Smoky Coastal Blue)', hex: '#8493A0', desc: '寧靜深邃，適合臥室助眠或書房' },
    { id: 'terracotta', name: '暮色陶土紅 (Terracotta Clay)', hex: '#B87463', desc: '藝術濃郁，BBQ 戶外熱情與美式復古' },
    { id: 'modern_dark', name: '曜石霧灰黑 (Display Noir)', hex: '#2B2E33', desc: '強烈對比聚光，適合精品櫥窗與現代科技' }
  ],

  // 核心家具/軟裝材質布料
  sofaFabrics: [
    { id: 'fabric_cream', name: '燕麥棉麻織布', hex: '#E2DBD0', style: 'Nordic' },
    { id: 'fabric_charcoal', name: '墨灰羊毛混紡', hex: '#484B52', style: 'Modern' },
    { id: 'leather_caramel', name: '焦糖復古植鞣皮', hex: '#A8683B', style: 'Vintage' },
    { id: 'velvet_forest', name: '深黛綠絲絨', hex: '#2A463B', style: 'Luxury' },
    { id: 'fabric_pastel', name: '淺薄荷親膚布', hex: '#B2CDBE', style: 'Kids' },
    { id: 'outdoor_waterproof', name: '抗UV防水戶外布', hex: '#8C857B', style: 'Outdoor' }
  ],

  // 點綴五金與色彩 (10% Accent)
  accentColors: [
    { id: 'brass_gold', name: '拉絲黃銅金', hex: '#C8A365', isMetal: true },
    { id: 'matte_black', name: '消光霧黑', hex: '#222224', isMetal: true },
    { id: 'burnt_orange', name: '活力暖焦橙', hex: '#D76B38', isMetal: false },
    { id: 'emerald_green', name: '翡翠生機綠', hex: '#2D6A4F', isMetal: false },
    { id: 'chrome_silver', name: '極簡拋光銀', hex: '#D8DCE0', isMetal: true }
  ],

  // 各空間專屬預設設計師風格
  stylePresets: [
    {
      id: 'preset_japandi',
      name: '日式奶油原木 (Japandi Calm)',
      spaceId: 'living',
      badge: '客廳經典',
      tagline: '淺橡木 + 奶油暖白 + 燕麥棉麻，純淨溫潤的治癒感',
      floorId: 'oak_light',
      wallColor: '#F7F4EE',
      sofaHex: '#E2DBD0',
      accentHex: '#C8A365',
      timeOfDay: 'day'
    },
    {
      id: 'preset_master_suite',
      name: '法式輕奢景觀主臥 (Master Suite)',
      spaceId: 'master_bedroom',
      badge: '主臥推薦',
      tagline: '人字拼實木 + 珍珠白主牆 + 黛綠絲絨與黃銅細節',
      floorId: 'herringbone_oak',
      wallColor: '#F8F6F1',
      sofaHex: '#2A463B',
      accentHex: '#C8A365',
      timeOfDay: 'sunset'
    },
    {
      id: 'preset_kids_nordic',
      name: '北歐童心遊樂 (Kids Wonder)',
      spaceId: 'kids_room',
      badge: '小孩房必看',
      tagline: '淺木地板 + 粉彩天藍牆 + 薄荷綠親膚布，無毒安全成長環境',
      floorId: 'oak_light',
      wallColor: '#CDE1E8',
      sofaHex: '#B2CDBE',
      accentHex: '#D76B38',
      timeOfDay: 'day'
    },
    {
      id: 'preset_senior_care',
      name: '全齡安心孝親 (Universal Comfort)',
      spaceId: 'elderly_room',
      badge: '孝親首選',
      tagline: '防滑軟木地板 + 暖灰陶砂牆 + 焦糖圓角家具，起居無障礙',
      floorId: 'cork_soft',
      wallColor: '#D7D1C5',
      sofaHex: '#A8683B',
      accentHex: '#C8A365',
      timeOfDay: 'day'
    },
    {
      id: 'preset_kitchen_island',
      name: '現代大理石中島 (Modern Kitchen)',
      spaceId: 'kitchen',
      badge: '料理天堂',
      tagline: '魚肚白大理石 + 霧黑俐落櫃體 + 黃銅吊燈，社交型餐廚',
      floorId: 'calacatta_marble',
      wallColor: '#F7F6F2',
      sofaHex: '#484B52',
      accentHex: '#C8A365',
      timeOfDay: 'day'
    },
    {
      id: 'preset_luxury_bath',
      name: '精品飯店衛浴 (Luxury Bath)',
      spaceId: 'bathroom',
      badge: '衛浴熱門',
      tagline: '魚肚白大理石 + 曜石霧黑五金 + 獨立蛋形浴缸，五星級沐浴享受',
      floorId: 'calacatta_marble',
      wallColor: '#F7F6F2',
      sofaHex: '#FAF8F5',
      accentHex: '#222224',
      timeOfDay: 'sunset'
    },
    {
      id: 'preset_bath_warm_travertine',
      name: '暖沙象牙洞石 SPA 衛浴 (413277)',
      spaceId: 'bathroom',
      badge: '413277 樣品',
      tagline: '413277 暖沙洞石地坪 + 象牙白主牆 + 復古黃銅花灑五金，五星 SPA 放鬆感',
      floorId: 'vendor_413277',
      wallColor: '#E0DED8',
      sofaHex: '#FAF8F5',
      accentHex: '#C8A365',
      timeOfDay: 'day'
    },
    {
      id: 'preset_bath_sage_mineral',
      name: '微風灰綠自然石板衛浴 (413278)',
      spaceId: 'bathroom',
      badge: '413278 樣品',
      tagline: '413278 微風灰綠石板地坪 + 灰綠石板主牆 + 消光黑五金，北歐日式自然石材',
      floorId: 'vendor_413278',
      wallColor: '#8B9584',
      sofaHex: '#FAF8F5',
      accentHex: '#222224',
      timeOfDay: 'day'
    },
    {
      id: 'preset_bath_noir_gold',
      name: '金砂黑曜玄武奢華衛浴 (413281)',
      spaceId: 'bathroom',
      badge: '413281 樣品',
      tagline: '413281 金砂黑曜地坪 + 黑曜主牆 + 閃耀金砂五金，現代極致輕奢',
      floorId: 'vendor_413281',
      wallColor: '#353436',
      sofaHex: '#FAF8F5',
      accentHex: '#A29258',
      timeOfDay: 'sunset'
    },
    {
      id: 'preset_bath_smoked_twilight',
      name: '暮光煙燻紫灰藝術衛浴 (413282)',
      spaceId: 'bathroom',
      badge: '413282 樣品',
      tagline: '413282 煙燻紫灰地坪 + 暮光微水泥牆 + 拋光鉻銀五金，前衛沉靜侘寂',
      floorId: 'vendor_413282',
      wallColor: '#756F73',
      sofaHex: '#FAF8F5',
      accentHex: '#D8DCE0',
      timeOfDay: 'night'
    },
    {
      id: 'preset_bbq_patio',
      name: '美式庭園 BBQ 派對 (Outdoor Grill)',
      spaceId: 'bbq_area',
      badge: '戶外熱門',
      tagline: '深灰青石板岩 + 戶外實木長桌 + 復古黃光串燈，聚會聖地',
      floorId: 'outdoor_slate',
      wallColor: '#DFDBD4',
      sofaHex: '#8C857B',
      accentHex: '#D76B38',
      timeOfDay: 'sunset'
    },
    {
      id: 'preset_vanlife',
      name: '微型車載 Vanlife (Cozy Camper)',
      spaceId: 'campervan',
      badge: '極簡露營',
      tagline: '芬蘭樺木夾板 + 焦糖皮革折疊沙發床，自由自在遊歷天地',
      floorId: 'camper_plywood',
      wallColor: '#ECE5DB',
      sofaHex: '#A8683B',
      accentHex: '#222224',
      timeOfDay: 'day'
    },
    {
      id: 'preset_boutique_window',
      name: '精品焦點櫥窗 (High Fashion)',
      spaceId: 'window_display',
      badge: '商業展陳',
      tagline: '曜石霧黑吸光背景 + 大理石展示柱 + 磁吸頂級聚光燈',
      floorId: 'calacatta_marble',
      wallColor: '#2B2E33',
      sofaHex: '#484B52',
      accentHex: '#C8A365',
      timeOfDay: 'night'
    }
  ]
};
