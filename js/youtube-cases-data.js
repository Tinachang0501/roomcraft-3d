/**
 * Curated YouTube Renovation Videos & Real-World Case Studies Gallery
 * Covering Residential Rooms, Outdoor Spaces, Campervan, and Retail Window Displays.
 */

const YouTubeCasesData = {
  videos: [
    {
      id: 'v_living',
      spaceId: 'living',
      youtubeId: 'W3_rGqF0w8w',
      title: '【Lo-Fi 空間改造】小坪數客廳也能擁有北歐奶油風！色彩配比與軟裝選物全公開',
      channel: 'Lo-Fi Warehouse',
      duration: '15:20',
      category: '居室空間',
      cover: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      tags: ['客廳配置', '奶油風', '60-30-10配比', '沙發選物'],
      summary: '示範如何運用低彩度大地色系營造客廳包覆感，沙發與窗簾的同色系微差技巧。'
    },
    {
      id: 'v_master',
      spaceId: 'master_bedroom',
      youtubeId: 'qQ2P6d9Fh60',
      title: '【幸福空間】主臥室這樣設計超好睡！獨立更衣室、格柵床頭板與全遮光隔音心法',
      channel: '幸福空間',
      duration: '13:40',
      category: '居室空間',
      cover: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      tags: ['主臥套房', '格柵床頭', '全遮光窗簾', '飯店感'],
      summary: '解構精品飯店級主臥室的配置關鍵：走道預留、無眩光床頭燈、更衣室滑門動線規劃。'
    },
    {
      id: 'v_kids',
      spaceId: 'kids_room',
      youtubeId: '7X1a-sBqL3Y',
      title: '【100室內設計】陪孩子長大的兒童房！安全無毒綠建材、蒙特梭利自主收納與成長型書桌',
      channel: '100室內設計',
      duration: '14:15',
      category: '居室空間',
      cover: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      tags: ['小孩房間', '無毒低甲醛', '玩具收納', '成長型桌椅'],
      summary: '針對 3-12 歲孩童安全打造：防撞圓角、低矮收納方格櫃、安全防觸電旋轉插座。'
    },
    {
      id: 'v_elderly',
      spaceId: 'elderly_room',
      youtubeId: '9D0k6Zp5T1w',
      title: '【全齡通用孝親房】家有長輩必看！零門檻無障礙、防滑軟木地板、夜間感應燈實測指南',
      channel: '好宅長照研究所',
      duration: '16:50',
      category: '居室空間',
      cover: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      tags: ['長輩房間', '孝親房', '防跌倒防滑', '無障礙動線'],
      summary: '揭秘孝親房關鍵尺寸：床高 45-50cm、走道 90cm 容納輪椅、起夜低位感應燈防跌。'
    },
    {
      id: 'v_kitchen',
      spaceId: 'kitchen',
      youtubeId: '3nQ2L9pW8eM',
      title: '【夢想大廚房】開放式中島黃金三角動線！大理石檯面防油污、洗碗機與插座避坑全集',
      channel: '料理空間美學',
      duration: '18:25',
      category: '居室空間',
      cover: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      tags: ['廚房中島', '黃金三角動線', '大理石檯面', '防濺板'],
      summary: '實測水槽、瓦斯爐、冰箱三點動線，中島走道雙人會車保留 100cm 的重要性。'
    },
    {
      id: 'v_courtyard',
      spaceId: 'courtyard',
      youtubeId: '2bK9T7uY4lP',
      title: '【露台與庭院改造】老舊陽台變身高質感渡假Villa！戶外柚木地板、遮陽傘與排水工法',
      channel: '綠意生活家',
      duration: '15:10',
      category: '戶外休憩',
      cover: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      tags: ['陽光庭院', '戶外柚木', '遮陽涼亭', '排水坡度'],
      summary: '戶外庭院不發霉積水關鍵：1.5% 洩水坡度、耐候塑木與防紫外線戶外沙發挑選。'
    },
    {
      id: 'v_garden',
      spaceId: 'back_garden',
      youtubeId: '5M9P0k7L2vB',
      title: '【後花園綠意造景】從雜草地到英式浪漫庭園！石板步道鋪設、低壓氣氛燈與四季花圃',
      channel: '園藝大師',
      duration: '17:30',
      category: '戶外休憩',
      cover: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
      tags: ['後花園', '石板步道', '草皮維護', '浪漫氛圍燈'],
      summary: '步道踏石間距 55-60cm 的人體工學，自動噴灌管線配置與夜間 12V 景觀燈安裝。'
    },
    {
      id: 'v_bbq',
      spaceId: 'bbq_area',
      youtubeId: '4R8L1m9Q5tY',
      title: '【戶外 BBQ 派對特輯】庭院烤肉吧台動線設計！下風處排煙、防油污青石板與實木長餐桌',
      channel: '美式庭院生活',
      duration: '16:00',
      category: '戶外休憩',
      cover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      tags: ['BBQ烤肉區', '不鏽鋼烤爐', '防油石板', '聚會長桌'],
      summary: '戶外派對烤肉區實戰指南：爐台設於下風處、防油煙石材地面、洗滌水槽與防水電源。'
    },
    {
      id: 'v_camper',
      spaceId: 'campervan',
      youtubeId: '6T3K9p2W8mQ',
      title: '【DIY 露營車改造全紀錄】Vanlife 微型空間極限利用！折疊沙發床、流理台與離網太陽能',
      channel: 'Vanlife 漫遊誌',
      duration: '21:10',
      category: '特色空間',
      cover: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
      tags: ['露營車配置', 'Vanlife', '多功能變形床', '車載輕量化'],
      summary: '不到 3 坪的微型魔法：左右平衡配重、輕量芬蘭夾板、折疊桌板與 12V 供電系統。'
    },
    {
      id: 'v_window',
      spaceId: 'window_display',
      youtubeId: '8N1V7k4L3wP',
      title: '【商業陳列美學】精品門市櫥窗設計秘訣！幾何展台視覺焦點、5:1 聚光對比與檔期敘事',
      channel: '時尚陳列筆記',
      duration: '12:40',
      category: '特色空間',
      cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      tags: ['櫥窗設計', '視覺行銷', '聚光軌道燈', '展台幾何'],
      summary: '吸引路人停駐的視覺黃金帶（1.2-1.6米）、超白防眩玻璃與留白負空間藝術。'
    },
    {
      id: 'v_bathroom',
      spaceId: 'bathroom',
      youtubeId: '5F6L8r9W2yK',
      title: '【衛浴裝潢避坑全攻略】乾濕分離尺寸大健檢！暖風機安裝位置、洩水坡度與防滑地磚實測',
      channel: '幸福空間',
      duration: '17:45',
      category: '居室空間',
      cover: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
      tags: ['風格衛浴', '乾濕分離', '蛋形浴缸', '四合一暖風機', '防滑地磚'],
      summary: '詳解淋浴區 90x90cm 舒適尺度、懸空浴櫃離地 20cm 防潮工法，以及暖風機裝在乾區的防感冒原理。'
    }
  ],

  realCases: [
    {
      id: 'case_bathroom',
      spaceId: 'bathroom',
      title: '台北大安 3坪 侘寂微水泥精品衛浴',
      style: '現代侘寂衛浴 (Wabi-Sabi Bath)',
      area: '3 坪 / 獨立衛浴套間',
      palette: ['#F7F6F2', '#F8F7F4', '#2B2E33', '#C8A365'],
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
      highlights: '義大利魚肚白大理石紋理通鋪，配置獨立蛋形浴缸與乾濕分離無框玻璃門，懸空大理石面盆搭配防霧LED光環鏡。'
    },
    {
      id: 'case_master',
      spaceId: 'master_bedroom',
      title: '台北信義 10坪 精品景觀主臥室',
      style: '法式輕奢 (Master Suite)',
      area: '10 坪 / 獨立更衣套房',
      palette: ['#F8F6F1', '#C6A580', '#2A463B', '#C8A365'],
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      highlights: '經典橡木人字拼通鋪，床頭深色木格柵結合暖光嵌燈，落地窗旁設置專屬絲絨閱讀單椅。'
    },
    {
      id: 'case_kids',
      spaceId: 'kids_room',
      title: '新竹竹北 6坪 北歐童趣成長孩童房',
      style: '清新北歐童趣 (Kids Nordic)',
      area: '6 坪 / 兒童多功能房',
      palette: ['#CDE1E8', '#D2B99B', '#B2CDBE', '#D76B38'],
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      highlights: '低甲醛綠建材全室把關，配置可升降人體工學書桌椅，中央圓形跳色地墊作為安全遊樂場。'
    },
    {
      id: 'case_elderly',
      spaceId: 'elderly_room',
      title: '台中南屯 8坪 全齡通用安心孝親房',
      style: '全齡通用友善 (Universal Care)',
      area: '8 坪 / 無障礙套房',
      palette: ['#D7D1C5', '#C8A882', '#A8683B', '#C8A365'],
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      highlights: '全室防滑軟木地板抗震緩衝，床邊隱藏式安全扶手與零門檻滑門，30cm 夜間低位感應燈。'
    },
    {
      id: 'case_kitchen',
      spaceId: 'kitchen',
      title: '高雄美術館 12坪 義大利奢石料理中島',
      style: '現代大理石餐廚 (Gourmet Kitchen)',
      area: '12 坪 / 開放式客餐廚',
      palette: ['#F7F6F2', '#F8F7F4', '#484B52', '#C8A365'],
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      highlights: '魚肚白大理石瀑布式料理中島，配置雙人高腳吧台椅，下嵌氣氛暖光條，兼顧烹飪與社交。'
    },
    {
      id: 'case_courtyard',
      spaceId: 'courtyard',
      title: '宜蘭員山 15坪 峇里島休閒景觀庭院',
      style: '渡假休閒庭院 (Resort Patio)',
      area: '15 坪 / 戶外休憩區',
      palette: ['#F0EEE9', '#A06E42', '#8C857B', '#2D6A4F'],
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      highlights: '耐候柚木棧道平台搭配白色立柱遮陽傘，抗UV布藝沙發與大型盆栽，打造不出門的渡假體驗。'
    },
    {
      id: 'case_bbq',
      spaceId: 'bbq_area',
      title: '桃園龍潭 16坪 戶外 BBQ 派對聚落',
      style: '美式庭園燒烤 (BBQ Patio)',
      area: '16 坪 / 戶外聚會區',
      palette: ['#DFDBD4', '#4A5056', '#5C4033', '#D76B38'],
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      highlights: '青石板防滑耐火地坪，內建不鏽鋼爐台與備料水槽，原木聚餐長桌可容納 10 人狂歡。'
    },
    {
      id: 'case_camper',
      spaceId: 'campervan',
      title: '自由出走 3.5坪 賓士微型露營車 Vanlife',
      style: '溫馨車載 Vanlife (Mobile Living)',
      area: '3.5 坪 / 旅居車廂',
      palette: ['#ECE5DB', '#E4CFB2', '#A8683B', '#222224'],
      image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80',
      highlights: '芬蘭樺木輕量夾板包覆全車，變形沙發床與折疊流理台，車頂太陽能充電離網野營。'
    },
    {
      id: 'case_window',
      spaceId: 'window_display',
      title: '台北大安 4坪 頂級時裝精品焦點櫥窗',
      style: '精品視覺行銷 (High-end Display)',
      area: '4 坪 / 臨街商業櫥窗',
      palette: ['#2B2E33', '#F8F7F4', '#484B52', '#C8A365'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      highlights: '超白低反射玻璃消除倒影，多層次大理石展台與模特兒剪影，5:1 高角度投射聚光燈焦點分明。'
    }
  ]
};
