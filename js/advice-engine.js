/**
 * Interior Design Intelligence & Sizing Rule Engine for RoomCraft 3D
 * Provides specialized ergonomic rules and layout tips for 11 distinct space types.
 */

const AdviceEngine = {
  getLuminance(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const rgb = parseInt(hex, 16);
    const r = ((rgb >> 16) & 255) / 255;
    const g = ((rgb >> 8) & 255) / 255;
    const b = (rgb & 255) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  getContrast(hex1, hex2) {
    const l1 = this.getLuminance(hex1) + 0.05;
    const l2 = this.getLuminance(hex2) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
  },

  analyzeConfiguration(config) {
    const { pings, spaceType, floor, wallColor, sofaHex, accentHex, timeOfDay } = config;
    const m2 = (pings * 3.3058).toFixed(1);

    // 專屬空間人體工學與配置建議
    let furnitureAdvice = {};
    let tips = [];
    let warnings = [];
    let harmonyScore = 90;

    switch (spaceType) {
      case 'elderly_room':
        furnitureAdvice = {
          sofa: '【全齡安心低床台】床高建議 45-50cm（含床墊），長者坐於床沿時雙腳能平踩地面，膝蓋呈 90 度，起臥最省力。',
          tv: '【柔和防眩照明】主照明避免直射眼部，床底及走道踢腳處配置 30cm 低位紅外線暖光感應燈，起夜不摸黑。',
          walkway: '【無障礙輪椅迴轉動線】走道淨寬需達 85-90cm，床邊至浴廁路徑全室「零門檻」，門扇建議改用橫拉滑門。',
          coffeeTable: '【防撞圓角與輔助扶手】床頭與便器旁務必預留安全扶手結構，家具一律挑選圓倒角避免磕碰刮傷。'
        };
        tips.push({
          title: '孝親房防滑係數指標',
          desc: '強烈推薦軟木地板或抗滑等級 R10 以上之防滑地磚，軟木具備微彈緩衝性，萬一跌倒能大幅降低骨折風險。'
        });
        tips.push({
          title: '一鍵緊急通報鈕配置',
          desc: '於床頭櫃易觸碰高度（離地 60cm）預留不斷電緊急壓扣開關，直通家人手機或公共警報器。'
        });
        break;

      case 'kids_room':
        furnitureAdvice = {
          sofa: '【安全成長床型】建議單人床挑選圓角原木或具備可拆卸防掉落護欄款式，床下空間可整合拉出式大型收納抽屜。',
          tv: '【護眼成長學習桌椅】桌高建議隨年齡可升降（52-76cm），椅背需具人體工學支撐，光源應從慣用手對側斜前方投射。',
          walkway: '【中央開闊遊戲區】盡量將家具靠兩側壁面配置，釋出房間中央完整 1.5x1.5 米地墊遊樂空間。',
          coffeeTable: '【開放式低矮玩具箱】收納櫃高度控制在 90-110cm 內，引導孩童從小建立自己收玩具的好習慣。'
        };
        tips.push({
          title: '兒童房無毒綠建材把關',
          desc: '塗料務必指名綠建材標章、零甲醛乳膠漆，板材選用 E0 / F1 等級，避免幼兒呼吸道過敏。'
        });
        tips.push({
          title: '插座安全旋轉保護蓋',
          desc: '全室插座務必加裝防觸電安全保護蓋，或選用內建機械式防單孔插入的安全型插座。'
        });
        break;

      case 'master_bedroom':
        furnitureAdvice = {
          sofa: '【大器 King Size 雙人床】建議配置 182x212cm 獨立筒大床，兩側保留至少 60-70cm 走道方便上下床與整理床單。',
          tv: '【飯店級臥室閱讀角】床尾或落地窗旁配置一張舒適包覆感單椅與金屬細腳邊几，打造專屬私人閱讀居心地。',
          walkway: '【更衣動線與梳妝鏡】更衣更衣室通道保留至少 80cm，梳妝台光線應採用 4000K 自然光柔和化妝燈。',
          coffeeTable: '【床頭格柵飾牆】床頭背牆可運用直櫺木格柵搭配局部暖光燈條，營造精品飯店般的層次奢華感。'
        };
        tips.push({
          title: '主臥隔音與全遮光雙層簾',
          desc: '窗簾建議規劃「蛇行布簾 + 透光紗簾」雙軌，遮光率達 95% 以上，確保高深層睡眠品質。'
        });
        break;

      case 'bedroom':
        furnitureAdvice = {
          sofa: '【標準雙人床尺度】建議 152x188cm 標準床，靠牆或置中皆可，床頭兩側配置極簡懸空抽屜替代落地笨重床頭櫃。',
          tv: '【壁掛電視或極簡畫作】小臥室可免設電視櫃，改以壁掛電視或留白掛一幅 60x80cm 抽象藝術畫。',
          walkway: '【衣櫃開門緩衝間距】若為平開門衣櫃，床側走道至少需留 75cm；若坪數小於 5 坪，強烈建議改用「推拉滑門衣櫃」。',
          coffeeTable: '【多功能工作/梳妝一體桌】可挑選長 90-120cm、深 50cm 的簡約細腿桌，整合辦公與保養機能。'
        };
        tips.push({
          title: '次臥留白放大術',
          desc: '淺色木地板搭配奶茶色牆面能自然擴大臥室空間感，天花板建議採用無主燈磁吸軌道燈或防眩嵌燈。'
        });
        break;

      case 'kitchen':
        furnitureAdvice = {
          sofa: '【社交型料理中島】中島高度建議 88-92cm，深度 80-100cm，整合不鏽鋼水槽與大理石外側 25cm 內縮吧台腳部空間。',
          tv: '【黃金料理三角動線】水槽、瓦斯爐/IH爐、冰箱三點連線周長應在 3.6 - 6.6 米之間，備料料理最省時流暢。',
          walkway: '【雙人會車安全走道】廚具檯面與中島之間走道需保留 90-110cm，確保冰箱開門、洗碗機掀蓋時依然暢通。',
          coffeeTable: '【吧台高腳椅高度】若中島高度 90cm，吧台椅座高應選 65cm（兩者落差維持約 25-30cm 乘坐最自然）。'
        };
        tips.push({
          title: '廚房抗污防濺板材質',
          desc: '瓦斯爐前方牆面建議選用一體成型「烤漆玻璃」或「義大利大板瓷磚」，無磁磚縫隙卡油垢，一擦即淨。'
        });
        tips.push({
          title: '抽油煙機風量與排風管',
          desc: '開放式廚房抽油煙機排風量建議挑選 18-22 m³/min 以上，風管轉彎不超過 2 處，杜絕油煙飄進公領域。'
        });
        break;

      case 'bathroom':
        furnitureAdvice = {
          sofa: '【乾濕分離與獨立浴缸】淋浴間尺寸建議至少 90x90cm（最小極限 80x80cm）不卡肘；獨立蛋形浴缸周圍預留 15-20cm 擦拭餘裕。',
          tv: '【懸空浴櫃與鏡面人體工學】浴櫃離地 20-25cm 避免水氣潮濕，檯面總高 80-85cm；防霧 LED 圓鏡中心高度設於 160-165cm。',
          walkway: '【馬桶起坐安全淨空】馬桶中心至兩側牆壁或浴櫃至少保留 40-45cm（總淨寬需達 80-90cm），馬桶前方保留 60cm 充裕伸腿動線。',
          coffeeTable: '【收納與恆溫毛巾架】壁掛電熱毛巾架安裝於出浴 1 步距離內（約 60-80cm），毛巾乾爽不發霉；淋浴區預留壁龕收納洗沐瓶罐。'
        };
        tips.push({
          title: '地坪防滑等級與洩水坡度',
          desc: '衛浴地磚務必指名抗滑等級 R10 或 R11（如霧面石英磚或水磨石），淋浴區需施作 1.5%~2% 洩水坡度，確保排水不積水。'
        });
        tips.push({
          title: '四合一暖風機安裝黃金位置',
          desc: '切勿將暖風機安裝於淋浴間正上方（洗澡時吹風會造成體感寒冷著涼），最理想位置為「乾區穿衣處上方」，除濕與保暖效果最高。'
        });
        break;

      case 'courtyard':
        furnitureAdvice = {
          sofa: '【抗UV防潑水戶外沙發】骨架建議選用陽極氧化鋁合金或進口柚木，座墊布料指名防褪色防潑水抗UV科技織布。',
          tv: '【耐候遮陽涼亭】配置直徑 2.5-3 米的戶外立柱遮陽傘或鋁合金百葉涼亭，夏日遮陽防雨，四季皆宜。',
          walkway: '【地坪排水洩水坡度】戶外地坪需施作 1.5% - 2% 排水斜度，雨水能順暢排入排水孔，避免木棧板積水受潮。',
          coffeeTable: '【水磨石/水泥圓茶几】挑選自重足夠之石材或水泥茶几，耐強風吹拂且不怕日曬雨淋。'
        };
        tips.push({
          title: '戶外木地板選材建議',
          desc: '高耐久推薦「緬甸柚木」或「高密度塑木 (WPC)」，塑木不生白蟻、不需定期刷漆，維護成本極低。'
        });
        break;

      case 'back_garden':
        furnitureAdvice = {
          sofa: '【實木景觀長凳】放置於樹蔭或圍籬邊角，長度約 140-160cm，作為沉澱心靈與欣賞四季花草的私人秘境。',
          tv: '【夜間景觀低壓氛圍燈】全區採用 12V 安全低壓暖黃投射燈打亮樹冠，圍籬懸掛防水氣氛小燈串。',
          walkway: '【石板步道跨步人體工學】天然青石板或花崗岩踏石，中心間距應維持 55-60cm，符合成年人漫步跨幅。',
          coffeeTable: '【自動噴灌系統預留】草皮與花台邊緣預留隱藏式旋轉噴灌噴頭與定時控制器，出國旅遊也不怕花草枯萎。'
        };
        tips.push({
          title: '花園土壤排水層規劃',
          desc: '底層務必鋪設碎石級配與透水不織布，防止暴雨積水爛根，面層回填 30cm 優質培養腐植土。'
        });
        break;

      case 'bbq_area':
        furnitureAdvice = {
          sofa: '【戶外長條原木聚餐桌】桌長 200-240cm，搭配雙側長凳，可輕鬆容納 8-10 人烤肉派對同樂。',
          tv: '【不鏽鋼獨立燒烤爐島台】採用 304 食品級不鏽鋼爐體，兩側配置耐高溫石英石或青石板岩備料工作台。',
          walkway: '【風向與下風處排煙規劃】烤肉爐台務必設於常態風向之「下風處」，避免炭火油煙灌入室內或吹向用餐座位。',
          coffeeTable: '【戶外洗滌槽與防水插座】爐台旁預留冷水水槽方便清洗食材生熟食，配置 IP66 戶外防水插座供應電烤盤/照明。'
        };
        tips.push({
          title: 'BBQ 區域地坪抗油防滑',
          desc: '烤肉區地坪極易滴落油脂，強烈推薦深色青石板岩或燒面花崗岩，具備抗高溫、高摩擦防滑、耐刷洗特點。'
        });
        break;

      case 'campervan':
        furnitureAdvice = {
          sofa: '【多功能變形沙發床】白天為雙排對座餐桌沙發，夜間拉出滑軌即變身為 140x190cm 舒適雙人床。',
          tv: '【微型流理台與折疊龍頭】配置不銹鋼圓形水槽、折疊龍頭與蓋板，蓋上蓋板即可當作料理切菜板。',
          walkway: '【車體中央縱深動線】中央通道淨寬維持 50-60cm，側邊滑門大開口時室內外一體通風無阻。',
          coffeeTable: '【車載掀起式折疊桌板】使用船用氣壓棒或滑軌折疊桌，不用時完全貼平側壁收納，釋放車內行走空間。'
        };
        tips.push({
          title: '露營車配重與輕量化材料',
          desc: '全車櫃體建議採用輕量芬蘭樺木夾板或鋁擠型骨架，左右兩側重量均勻配置，維持車輛高速行駛穩定度。'
        });
        tips.push({
          title: '離網水電雙向平衡',
          desc: '車頂規劃 300W-400W 單晶太陽能板 + 200Ah 磷酸鐵鋰電池，並配置 80-100L 清水箱，支援 2-3 天野營自給自足。'
        });
        break;

      case 'window_display':
        furnitureAdvice = {
          sofa: '【高低錯落幾何展台】配置 30cm、60cm、90cm 不同高度的展示台柱，打破水平單調，引導行人視線節奏。',
          tv: '【視線黃金焦點高度】主角商品陳列於離地 1.2 - 1.6 米視線黃金帶，路過行人一眼即可被吸引捕捉。',
          walkway: '【後方陳列師維護走道】櫥窗玻璃至後背板之間至少保留 80cm 作業維護動線，方便定期更換檔期陳列與人台換裝。',
          coffeeTable: '【頂部磁吸聚光軌道燈】投射比建議 5:1（焦點商品亮度為背景的 5 倍），色溫採用 3500K-4000K 高演色性光源。'
        };
        tips.push({
          title: '抗反光低反射超白玻璃',
          desc: '櫥窗玻璃務必指定「超白防眩低反射玻璃 (Low-Reflectance Glass)」，白天強光下依然清晰通透，不被倒影干擾。'
        });
        break;

      default: // living
        furnitureAdvice = {
          sofa: pings <= 5 ? '雙人精巧無扶手沙發（長 150-180cm），細金屬離地腳維持穿透感。' : '220-260cm 標準三人沙發或 L 型海灣沙發。',
          tv: pings <= 6 ? '建議 43-50 吋壁掛電視，搭配懸空超薄電視櫃。' : '建議 55-65 吋電視，電視牆到沙發距離約 3 米。',
          walkway: '主動線走道保留 75-85cm，茶几至沙發間距保留 35-40cm。',
          coffeeTable: '建議雙拼圓几取代笨重大方几，動線圓潤安全。'
        };
        tips.push({
          title: '客廳採光通透秘訣',
          desc: '淺色地坪搭配大片自然採光，能大幅度提升視覺開闊度，家具多選細腳離地款式。'
        });
        break;
    }

    // 預算分配
    const budgetBreakdown = [
      { category: '硬裝基礎工程', ratio: 40, desc: '水電重新配管、防水泥作、耐磨地坪工程' },
      { category: '木作收納與固定設施', ratio: 30, desc: '系統櫃、流理台、展台或戶外涼亭平台' },
      { category: '核心活動家具', ratio: 20, desc: '床組、沙發、餐桌椅、燒烤設備或吧台椅' },
      { category: '風格軟裝與情境照明', ratio: 10, desc: '燈具、地毯、窗簾、植栽與飾品' }
    ];

    return {
      pings,
      m2,
      harmonyScore: Math.min(98, Math.max(75, harmonyScore)),
      proportions: {
        base: { percentage: 60, name: '基底 60% (主牆/地坪)', hex: wallColor },
        secondary: { percentage: 30, name: '主體 30% (家具/櫃體)', hex: sofaHex },
        accent: { percentage: 10, name: '點綴 10% (五金/飾品)', hex: accentHex }
      },
      furnitureAdvice,
      tips,
      warnings,
      budgetBreakdown
    };
  },

  generateAIPrompts(config) {
    const { pings, spaceType, floor, wallColor, sofaHex, accentHex, timeOfDay } = config;
    const m2 = (pings * 3.3058).toFixed(0);

    const spaceNameEn = {
      living: 'modern luxury living room',
      bedroom: 'cozy contemporary bedroom',
      master_bedroom: 'grand master bedroom suite with reading lounge',
      kids_room: 'nordic pastel kids bedroom and creative playroom',
      elderly_room: 'universal accessible senior comfort bedroom with safety design',
      kitchen: 'modern open concept kitchen with marble island and barstools',
      courtyard: 'sunlit outdoor patio courtyard with teak deck and pergola',
      back_garden: 'lush green landscaped back garden with stepping stones and cozy bench',
      bbq_area: 'outdoor BBQ entertaining patio with stainless steel grill and wooden dining table',
      campervan: 'cozy custom wooden campervan vanlife interior with convertible bed',
      window_display: 'high-end boutique storefront window display with pedestal podiums',
      bathroom: 'luxury modern spa bathroom with freestanding oval bathtub, glass shower, marble floating vanity'
    }[spaceType] || 'interior space';

    const spaceNameZh = {
      living: '客廳',
      bedroom: '臥室',
      master_bedroom: '主臥室',
      kids_room: '小孩子的房間',
      elderly_room: '老人家房間 (孝親房)',
      kitchen: '現代廚房與中島',
      courtyard: '陽光庭院',
      back_garden: '後花園綠意天地',
      bbq_area: '戶外 BBQ 聚會區',
      campervan: '露營車配置 (Vanlife)',
      window_display: '精緻櫥窗設計',
      bathroom: '風格衛浴空間'
    }[spaceType] || '空間配置';

    const timeAtmosphere = {
      day: 'bathed in bright morning natural sunlight, airy and tranquil atmosphere',
      sunset: 'illuminated by warm golden hour sunset glow, cinematic soft shadows',
      night: 'atmospheric evening with cozy 3000K warm interior ambient lighting and fairy lights'
    }[timeOfDay] || 'bright natural sunlight';

    const promptEn = `Award-winning architectural photography of a ${m2} sqm ${spaceNameEn}, designed with high-quality ${floor.name} (${floor.type} texture), soothing accent background in hex code ${wallColor}, designer furniture upholstered in ${sofaHex} fabric with accents in ${accentHex}, ${timeAtmosphere}, captured on Hasselblad 500C, architectural digest editorial, raytracing photorealistic 8k, ultra-detailed textures, perfectly balanced composition --ar 16:9 --v 6.0`;

    const promptZh = `【空間類型】${spaceNameZh}（約 ${pings} 坪 / ${m2} 平方公尺）
【地坪設計】${floor.name}，兼顧耐用防滑與空間質感延伸
【色彩配置】黃金 60-30-10 法則，主牆面採用 ${wallColor}，核心家具選用 ${sofaHex}，五金與飾品以 ${accentHex} 精準點綴
【光影氛圍】${timeOfDay === 'day' ? '充沛自然晨光穿透，明亮開闊' : timeOfDay === 'sunset' ? '黃金夕陽斜射入室，放鬆溫馨' : '夜間 3000K 暖光情境照明，低眩光舒適安全'}
【機能規劃】遵循人體工學動線尺寸與全齡通用安全標準，兼顧視覺美感與實用收納。`;

    return { promptEn, promptZh };
  },

  // 計算自訂家具尺寸佔地比例與動線評估
  calculateFurnitureProportions(pings, item) {
    const { name, lengthCm, widthCm, heightCm, type } = item;
    const roomM2 = pings * 3.3058;
    const furnAreaM2 = (lengthCm * widthCm) / 10000;
    const ratioPercent = ((furnAreaM2 / roomM2) * 100).toFixed(1);

    // 估算房間平均寬度 (以正方形/矩形概算)
    const approxRoomWidthCm = Math.round(Math.sqrt(roomM2) * 100);
    const approxWalkwayCm = Math.max(30, Math.round((approxRoomWidthCm - lengthCm) / 2));

    let status = 'ideal';
    let statusText = '黃金尺度配比';
    let statusClass = 'text-emerald-700 bg-emerald-100 border-emerald-300';
    let advice = `此家具佔房間總地坪約 ${ratioPercent}%，佔比適中，能維持良好空間呼吸感與生活動線。`;

    if (ratioPercent > 22 || lengthCm > approxRoomWidthCm * 0.72) {
      status = 'bulky';
      statusText = '尺寸偏大警示';
      statusClass = 'text-amber-800 bg-amber-100 border-amber-300';
      advice = `⚠️ 家具佔地達 ${ratioPercent}%，兩側預估走道僅剩約 ${approxWalkwayCm}cm（人體工學建議走道需大於 70-80cm）。建議長度縮減至 ${(approxRoomWidthCm * 0.65)|0}cm 以內，或選擇低背、無扶手、細金屬腳款式以減少視覺體量。`;
    } else if (ratioPercent < 8) {
      status = 'small';
      statusText = '尺度偏小留白多';
      statusClass = 'text-blue-700 bg-blue-100 border-blue-300';
      advice = `家具佔比僅 ${ratioPercent}%，空間動線非常開闊！可考慮搭配地毯、立燈或單椅來豐富層次，避免顯得過於空曠。`;
    }

    return {
      name,
      lengthCm,
      widthCm,
      heightCm,
      furnAreaM2: furnAreaM2.toFixed(2),
      roomM2: roomM2.toFixed(1),
      ratioPercent,
      approxWalkwayCm,
      status,
      statusText,
      statusClass,
      advice
    };
  }
};
