// ============================================
// ShowME App - Dummy Data: Shows
// ============================================

import { Show, ShowDate, ShowFilters } from '../types/types';

// Helper to generate dates for the next 30 days
const generateDates = (
  startOffset: number = 0,
  count: number = 15
): ShowDate[] => {
  const dates: ShowDate[] = [];
  const today = new Date();

  for (let i = startOffset; i < startOffset + count; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    if (Math.random() > 0.8 && i > 0) continue;

    const availability =
      Math.random() > 0.7
        ? 'high_demand'
        : Math.random() > 0.5
        ? 'limited'
        : 'available';

    dates.push({
      date: date.toISOString().split('T')[0],
      availability,
      times: [
        {
          id: `time-${i}-1`,
          time: '19:00',
          availableSeats: Math.floor(Math.random() * 100) + 50,
          totalSeats: 200,
          price: Math.floor(Math.random() * 80) + 100,
          isLastMinuteDeal: i === 0 && Math.random() > 0.5,
          lastMinutePrice: Math.floor(Math.random() * 50) + 50,
        },
        {
          id: `time-${i}-2`,
          time: '21:00',
          availableSeats: Math.floor(Math.random() * 80) + 30,
          totalSeats: 200,
          price: Math.floor(Math.random() * 80) + 100,
        },
      ],
    });
  }
  return dates;
};

export const shows: Show[] = [
  {
    id: 'show-1',
    title: 'Dathilonim',
    titleHe: 'דתילונים',
    titleRu: 'Датилоним',
    description:
      'A hilarious comedy about the clash between secular and religious neighbors in a Tel Aviv building.',
    descriptionHe:
      'קומדיה מצחיקה על המפגש בין שכנים חילונים ודתיים בבניין בתל אביב.',
    descriptionRu:
      'Веселая комедия о столкновении светских и религиозных соседей.',
    imageUrl:
      'https://s3.il-central-1.amazonaws.com/mevalim.co.il/wp-content/uploads/2025/01/23123519/%D7%93%D7%AA%D7%99%D7%9C%D7%95%D7%A0%D7%99%D7%9D_600x495.jpeg',
    galleryImages: [
      'https://images.maariv.co.il/image/upload/f_auto,fl_lossy/c_fill,g_faces:center,w_1200/922690',
      'https://www.israelhayom.co.il/wp-content/uploads/2024/06/30/30/%D7%93%D7%AA%D7%99%D7%9C%D7%95%D7%A0%D7%99%D7%9D-%D7%A7%D7%95%D7%A7%D7%95-2048x1362.jpg',
    ],
    theaterId: 'theater-2',
    hallLayoutId: 'traditional',
    categories: ['comedy', 'popular'],
    duration: 120,
    rating: 4.7,
    reviewCount: 342,
    startingPrice: 149,
    originalPrice: 189,
    badges: ['popular_in_area', 'selling_fast'],
    actorIds: ['actor-1', 'actor-3'],
    availableDates: generateDates(0, 20),
    isActive: true,
    premiereDate: '2023-01-15',
  },
  {
    id: 'show-2',
    title: 'Romeo and Juliet',
    titleHe: 'רומיאו ויוליה',
    titleRu: 'Ромео и Джульетта',
    description:
      "Shakespeare's timeless love story reimagined for modern Israel.",
    descriptionHe: 'סיפור האהבה הנצחי של שייקספיר בגרסה ישראלית מודרנית.',
    descriptionRu:
      'Вечная история любви Шекспира в современной израильской интерпретации.',
    imageUrl:
      'https://www.habima.co.il/wp-content/uploads/2024/09/380X600-2-1.jpg',
    galleryImages: [
      'https://www.habima.co.il/wp-content/uploads/2024/09/0S7A9891-683x1024.jpg',
    ],
    theaterId: 'theater-1',
    hallLayoutId: 'opera-house',
    categories: ['drama', 'romance', 'popular'],
    duration: 150,
    rating: 4.9,
    reviewCount: 567,
    startingPrice: 175,
    badges: ['popular_in_area'],
    actorIds: ['actor-2', 'actor-5'],
    availableDates: generateDates(0, 25),
    isActive: true,
    premiereDate: '2022-11-20',
  },
  {
    id: 'show-3',
    title: 'Chabadniks',
    titleHe: 'חבדניקים',
    titleRu: 'Хабадники',
    description:
      "Yehuda and Chaim, a pair of 23-year-old twin brothers from Kfar Chabad, the first – a genius in Torah and the second – not a genius and certainly not in Torah, must find a match. They embark on a 'matchmaking operation' and arrive at a reputable matchmaker in a shady neighborhood on the outskirts of Tel Aviv and get involved with Menashe, the head of a crime family and owner of a strip club, who terrorizes the neighborhoods residents. What began as a journey to find a partner turns into a whirlwind of forbidden temptations and a tangle that even God himself could probably resolve.The Chabadniks a funny, witty, cheeky and surprising musical that you'll want to see 31 times.",
    descriptionHe: 'קומדיה מוזיקלית מחממת לב העוקבת אחרי הרפתקאות שליחי חב״ד.',
    descriptionRu:
      'Душевная музыкальная комедия о приключениях посланников Хабад.',
    imageUrl:
      'https://www.cameri.co.il/prdPics/shows/desktop_10899_161236_show_image.jpg',
    galleryImages: [
      'https://www.cameri.co.il/prdPics/shows/10899_529739_gallery_item_3.jpg',
      'https://www.cameri.co.il/prdPics/shows/10899_186081_gallery_item_2.jpg',
      'https://www.cameri.co.il/prdPics/shows/10899_201928_gallery_item_5.jpg',
      'https://www.cameri.co.il/prdPics/shows/10899_757485_gallery_item_7.jpg',
    ],
    theaterId: 'theater-3',
    hallLayoutId: 'cameri-hall-1',
    categories: ['musical', 'comedy', 'popular', 'long_running'],
    duration: 160,
    rating: 4.8,
    reviewCount: 892,
    startingPrice: 189,
    badges: ['selling_fast', 'popular_in_area'],
    actorIds: ['actor-2', 'actor-4'],
    availableDates: generateDates(0, 30),
    isActive: true,
    premiereDate: '2021-06-10',
  },
  {
    id: 'show-4',
    title: 'Zero Motivation',
    titleHe: 'אפס ביחסי אנוש',
    titleRu: 'Дибук',
    description:
      'Zohar and Daffi are two soldiers trying to serve out their mandatory service with the IDF. On their way back to base after the weekend Daffi bumps into a new girl Tehila and, believing that she is her replacement, takes her under her wing. Daffi and Zohar work menial jobs with Daffi being forced to shred paper.',
    descriptionHe: 'סיפור מרדים על אהבה ודיבוק מהפולקלור היהודי.',
    descriptionRu:
      'Завораживающая история о любви и одержимости из еврейского фольклора.',
    imageUrl:
      'https://img.mako.co.il/2019/10/28/Zero_COmmunication_Show_19_1_i.jpg',
    galleryImages: [
      'https://www.tel-aviv.gov.il/UploadPic/3190ee32b339456e82643de64c44ada7.jpg',
      'https://medias.timeout.co.il/www/uploads/2019/10/%D7%90%D7%A4%D7%A1_%D7%91%D7%99%D7%97%D7%A1%D7%99_%D7%90%D7%A0%D7%95%D7%A93_%D7%A6%D7%99%D7%9C%D7%95%D7%9D_%D7%A8%D7%93%D7%99_%D7%A8%D7%95%D7%91%D7%99%D7%A0%D7%A9%D7%98%D7%99%D7%99%D7%9F-1140x641.jpg',
      'https://go.galil.gov.il/html5/web/2026/28556ImageFile2.jpg',
      'https://images1.ynet.co.il/PicServer5/2019/10/27/9561325/956131401001297640360no.jpg',
    ],
    theaterId: 'theater-4',
    hallLayoutId: 'studio',
    categories: ['drama', 'suspense'],
    duration: 110,
    rating: 4.5,
    reviewCount: 234,
    startingPrice: 129,
    badges: ['new'],
    actorIds: ['actor-4', 'actor-6'],
    availableDates: generateDates(0, 15),
    isActive: true,
    premiereDate: '2024-10-01',
  },
  {
    id: 'show-5',
    title: 'Priscilla Queen Of The Desert',
    titleHe: 'פריסיליה מלכת המדבר',
    titleRu: 'Салах Шабати',
    description:
      'The beloved Israeli classic brought to the stage with new energy.',
    descriptionHe: 'הקלאסיקה הישראלית האהובה מועלית לבמה באנרגיה חדשה.',
    descriptionRu: 'Любимая израильская классика на сцене с новой энергией.',
    imageUrl: 'https://www.megalean.co.il/img_mega/sp_1518_2b3f7035b6968ec.jpg',
    galleryImages: [
      'https://www.habima.co.il/wp-content/uploads/2024/12/600X380-6.jpg',
      'https://ynet-pic1.yit.co.il/cdn-cgi/image/f=auto,w=740,q=75/picserver6/crop_images/2025/05/28/rkbXgz004fxx/rkbXgz004fxx_651_588_1716_966_0_x-large.jpg',
    ],
    theaterId: 'theater-1',
    hallLayoutId: 'amphitheater',
    categories: ['comedy', 'musical', 'long_running'],
    duration: 140,
    rating: 4.6,
    reviewCount: 456,
    startingPrice: 499,
    badges: ['popular_in_area'],
    actorIds: ['actor-1', 'actor-5'],
    availableDates: generateDates(0, 20),
    isActive: true,
    premiereDate: '2022-03-15',
  },
  {
    id: 'show-6',
    title: 'Chicago',
    titleHe: 'שיקאגו',
    titleRu: 'Сон в летнюю ночь',
    description:
      "Shakespeare's magical comedy in a enchanting outdoor production.",
    descriptionHe: 'הקומדיה הקסומה של שייקספיר בהפקה חיצונית מרהיבה.',
    descriptionRu:
      'Волшебная комедия Шекспира в очаровательной постановке на открытом воздухе.',
    imageUrl:
      'https://www.israel-opera.co.il/wp-content/uploads/2025/06/F0_0490_0490_chicago_reshima1.webp',
    galleryImages: [
      'https://www.israel-opera.co.il/wp-content/uploads/2025/06/F0_0490_0490_chicago_reshima1.webp',
      'https://www.israelhayom.co.il/wp-content/uploads/2022/04/18/15359006929586_b-scaled.jpg',
    ],
    theaterId: 'theater-5',
    hallLayoutId: 'thrust',
    categories: ['comedy', 'romance'],
    duration: 130,
    rating: 4.4,
    reviewCount: 189,
    startingPrice: 139,
    badges: ['special_price'],
    actorIds: ['actor-3', 'actor-6'],
    availableDates: generateDates(2, 18),
    isActive: true,
    premiereDate: '2024-06-20',
  },
  {
    id: 'show-7',
    title: 'Cabaret',
    titleHe: 'קברט',
    titleRu: 'Визит оркестра',
    description: 'The Tony Award-winning musical returns to Israel.',
    descriptionHe: 'המחזמר הזוכה בפרס טוני חוזר לישראל.',
    descriptionRu: 'Мюзикл, удостоенный премии Тони, возвращается в Израиль.',
    imageUrl:
      'https://www.cameri.co.il/prdPics/shows/desktop_show_11341_177050_show_image.jpg',
    galleryImages: [
      'https://www.cameri.co.il/prdPics/shows/desktop_show_11341_177050_show_image.jpg',
      'https://www.cameri.co.il/prdPics/shows/mobile_show_11341_185920_show_image_mobile.jpg',
    ],
    theaterId: 'theater-3',
    hallLayoutId: 'cameri-hall-1',
    categories: ['musical', 'drama', 'popular'],
    duration: 100,
    rating: 4.9,
    reviewCount: 723,
    startingPrice: 199,
    badges: ['selling_fast'],
    actorIds: ['actor-2', 'actor-6'],
    availableDates: generateDates(0, 25),
    isActive: true,
    premiereDate: '2023-09-01',
  },
  {
    id: 'show-8',
    title: 'Ringo',
    titleHe: 'רינגו',
    titleRu: 'Быстрые свидания',
    description: 'A fast-paced comedy about modern dating in Tel Aviv.',
    descriptionHe: 'קומדיה מהירה על דייטינג מודרני בתל אביב.',
    descriptionRu: 'Динамичная комедия о современных свиданиях в Тель-Авиве.',
    imageUrl:
      'https://dramaisrael.org/wp-content/uploads/2024/10/%D7%A4%D7%95%D7%A1%D7%98%D7%A8-%D7%A8%D7%99%D7%A0%D7%92%D7%95.jpg',
    galleryImages: [
      'https://www.cameri.co.il/prdPics/shows/10772_196960_gallery_item_6.jpg',
    ],
    theaterId: 'theater-2',
    hallLayoutId: 'studio',
    categories: ['comedy', 'romance', 'short'],
    duration: 80,
    rating: 4.3,
    reviewCount: 298,
    startingPrice: 99,
    originalPrice: 129,
    badges: ['special_price'],
    actorIds: ['actor-4', 'actor-7'],
    availableDates: generateDates(0, 15),
    isActive: true,
    premiereDate: '2024-02-14',
  },
  {
    id: 'show-9',
    title: 'Singer',
    titleHe: 'זינגר',
    titleRu: 'Гетто',
    description: 'A powerful drama about the Vilna Ghetto theater during WWII.',
    descriptionHe: 'דרמה עוצמתית על התיאטרון בגטו וילנה במלחמת העולם השנייה.',
    descriptionRu:
      'Мощная драма о театре в Вильнюсском гетто во время Второй мировой войны.',
    imageUrl:
      'https://www.cameri.co.il/prdPics/shows/desktop_show_11222_101423_show_image.jpg',
    galleryImages: [
      'https://www.cameri.co.il/prdPics/shows/show_11222_209844_gallery_item_2.jpg',
      'https://www.cameri.co.il/prdPics/shows/show_11222_279897_gallery_item_3.jpg',
    ],
    theaterId: 'theater-6',
    hallLayoutId: 'opera-house',
    categories: ['drama'],
    duration: 145,
    rating: 4.8,
    reviewCount: 412,
    startingPrice: 149,
    badges: [],
    actorIds: ['actor-7', 'actor-8'],
    availableDates: generateDates(3, 12),
    isActive: true,
    premiereDate: '2023-04-18',
  },
  {
    id: 'show-10',
    title: 'Pride and Prejudice',
    titleHe: 'גאווה ודעה קדומה',
    titleRu: 'Гордость и предубеждение',
    description: "Jane Austen's masterpiece adapted for the Israeli stage.",
    descriptionHe: 'יצירת המופת של ג׳יין אוסטין מותאמת לבמה הישראלית.',
    descriptionRu: 'Шедевр Джейн Остин в израильской сценической адаптации.',
    imageUrl:
      'https://www.habama.co.il/Habama/Upload/Theater/%D7%92%D7%90%D7%95%D7%95%D7%94-%D7%95%D7%93%D7%A2%D7%94-%D7%A7%D7%93%D7%95%D7%9E%D7%94-%D7%99%D7%95%D7%A1%D7%99-%D7%A6%D7%91%D7%A7%D7%A8.jpg',
    galleryImages: [
      'https://www.habama.co.il/Habama/Upload/Theater/%D7%92%D7%90%D7%95%D7%95%D7%94%20%D7%95%D7%93%D7%A2%D7%94%20%D7%A7%D7%93%D7%95%D7%9E%D7%945.jpg',
    ],
    theaterId: 'theater-8',
    hallLayoutId: 'traditional',
    categories: ['drama', 'romance'],
    duration: 155,
    rating: 4.6,
    reviewCount: 267,
    startingPrice: 139,
    badges: ['new'],
    actorIds: ['actor-8'],
    availableDates: generateDates(1, 18),
    isActive: true,
    premiereDate: '2024-11-01',
  },
  {
    id: 'show-11',
    title: 'West Side Story',
    titleHe: 'סיפור הפרברים',
    titleRu: 'Фабрика смеха',
    description: 'Stand-up comedy meets theater in this unique production.',
    descriptionHe: 'סטנדאפ פוגש תיאטרון בהפקה ייחודית זו.',
    descriptionRu:
      'Стендап встречается с театром в этой уникальной постановке.',
    imageUrl:
      'https://imagedelivery.net/H97yLaUYEkme1ie0DgmsbQ/72508ac2-383a-4de1-f66d-176ce558f100/public',
    galleryImages: [
      'https://www.habama.co.il/habama/2018/%D7%A1%D7%99%D7%A4%D7%95%D7%A8-%D7%94%D7%A4%D7%A8%D7%91%D7%A8%D7%99%D7%9D-%D7%91%D7%99%D7%AA-%D7%9C%D7%99%D7%A1%D7%99%D7%9F-1-%D7%A6%D7%99%D7%9C%D7%95%D7%9D-%D7%A9%D7%99-%D7%A4%D7%A8%D7%A0%D7%A7%D7%95.jpg',
      'https://images1.ynet.co.il/PicServer4/2016/03/02/6854140/tap.jpg',
    ],
    theaterId: 'theater-7',
    hallLayoutId: 'amphitheater',
    categories: ['comedy', 'short'],
    duration: 75,
    rating: 4.2,
    reviewCount: 156,
    startingPrice: 79,
    badges: ['last_chance'],
    actorIds: ['actor-1'],
    availableDates: generateDates(0, 8),
    isActive: true,
    premiereDate: '2024-08-01',
  },
  {
    id: 'show-12',
    title: 'Angels in White',
    titleHe: 'מלאכים בלבן',
    titleRu: 'Цветы лиловые полей',
    description: 'The powerful musical about resilience, love, and sisterhood.',
    descriptionHe: 'המחזמר העוצמתי על חוסן, אהבה ואחווה.',
    descriptionRu: 'Мощный мюзикл о стойкости, любви и сестринстве.',
    imageUrl:
      'https://www.habima.co.il/wp-content/uploads/2025/09/496X818-A-%D7%9E%D7%9C%D7%90%D7%9B%D7%99%D7%9D-%D7%91%D7%9C%D7%91%D7%9F.jpg',
    galleryImages: [
      'https://www.tel-aviv.gov.il/BenefitsPic/9cfcdb487e6842faada6e6d576bda7aa.jpg',
    ],
    theaterId: 'theater-1',
    hallLayoutId: 'arena-wings',
    categories: ['musical', 'drama', 'lgbt'],
    duration: 160,
    rating: 4.7,
    reviewCount: 389,
    startingPrice: 179,
    badges: ['popular_in_area'],
    actorIds: ['actor-2', 'actor-6'],
    availableDates: generateDates(0, 22),
    isActive: true,
    premiereDate: '2024-01-20',
  },
];

// Helper functions
export const getShowById = (id: string): Show | undefined => {
  return shows.find((show) => show.id === id);
};

export const getShowsByTheater = (theaterId: string): Show[] => {
  return shows.filter((show) => show.theaterId === theaterId);
};

export const getShowsByCategory = (category: string): Show[] => {
  return shows.filter((show) => show.categories.includes(category as any));
};

export const filterShows = (
  filters: ShowFilters,
  theaterLocation?: Map<string, string>
): Show[] => {
  return shows.filter((show) => {
    if (!show.isActive) return false;

    // Location filter - would need theater data
    // Category filter
    if (filters.categories?.length) {
      const hasCategory = filters.categories.some((cat) =>
        show.categories.includes(cat)
      );
      if (!hasCategory) return false;
    }

    // Price filter
    if (filters.priceMin && show.startingPrice < filters.priceMin) return false;
    if (filters.priceMax && show.startingPrice > filters.priceMax) return false;

    return true;
  });
};

export const searchShows = (query: string): Show[] => {
  const lowerQuery = query.toLowerCase();
  return shows.filter(
    (show) =>
      show.title.toLowerCase().includes(lowerQuery) ||
      show.titleHe.includes(query) ||
      show.titleRu.toLowerCase().includes(lowerQuery)
  );
};

export default shows;
