// ============================================
// ShowME App - Dummy Data: Theaters
// ============================================

import { Theater } from '../types/types';

export const theaters: Theater[] = [
  {
    id: 'theater-1',
    name: 'Habima Theatre',
    nameHe: 'תיאטרון הבימה',
    nameRu: 'Театр Габима',
    address: 'Habima Square, Tel Aviv',
    addressHe: 'כיכר הבימה, תל אביב',
    addressRu: 'Площадь Габима, Тель-Авив',
    location: 'tel_aviv',
    coordinates: {
      latitude: 32.0731,
      longitude: 34.7795,
    },
    imageUrl:
      'https://s3.il-central-1.amazonaws.com/mevalim.co.il/wp-content/uploads/2025/10/22104107/%D7%A9%D7%95%D7%91%D7%A8%D7%99-%D7%A7%D7%95%D7%A4%D7%95%D7%AA-4-1024x1024.jpg',
    seatingCapacity: 900,
  },
  {
    id: 'theater-2',
    name: 'Beit Lessin Theatre',
    nameHe: 'תיאטרון בית לסין',
    nameRu: 'Театр Бейт Лессин',
    address: '101 Dizengoff Street, Tel Aviv',
    addressHe: 'דיזנגוף 101, תל אביב',
    addressRu: 'Дизенгоф 101, Тель-Авив',
    location: 'tel_aviv',
    coordinates: {
      latitude: 32.0834,
      longitude: 34.7731,
    },
    imageUrl:
      'https://s3.il-central-1.amazonaws.com/mevalim.co.il/wp-content/uploads/2025/10/22101336/%D7%A9%D7%95%D7%91%D7%A8%D7%99-%D7%A7%D7%95%D7%A4%D7%95%D7%AA-3.jpg',
    seatingCapacity: 600,
  },
  {
    id: 'theater-3',
    name: 'Cameri Theatre',
    nameHe: 'תיאטרון הקאמרי',
    nameRu: 'Театр Камери',
    address: '19 Shaul Hamelech Boulevard, Tel Aviv',
    addressHe: 'שדרות שאול המלך 19, תל אביב',
    addressRu: 'Бульвар Шауль Хамелех 19, Тель-Авив',
    location: 'tel_aviv',
    coordinates: {
      latitude: 32.0725,
      longitude: 34.787,
    },
    imageUrl:
      'https://www.habama.co.il/Upload/MediaFiles/%D7%94%D7%A7%D7%90%D7%9E%D7%A8%D7%99-%D7%92%D7%93%D7%95%D7%9C.jpg',
    seatingCapacity: 800,
  },
  {
    id: 'theater-4',
    name: 'Gesher Theatre',
    nameHe: 'תיאטרון גשר',
    nameRu: 'Театр Гешер',
    address: '19 Yerushalayim Avenue, Jaffa',
    addressHe: 'שדרות ירושלים 19, יפו',
    addressRu: 'Проспект Иерусалима 19, Яффо',
    location: 'tel_aviv',
    coordinates: {
      latitude: 32.0518,
      longitude: 34.7517,
    },
    imageUrl:
      'https://www.gesher-theatre.co.il/Warehouse/userUploadFiles/Image/gesher_theatre_logo.jpg',
    seatingCapacity: 500,
  },
  {
    id: 'theater-5',
    name: 'Jerusalem Khan Theatre',
    nameHe: 'תיאטרון חאן ירושלים',
    nameRu: 'Иерусалимский театр Хан',
    address: '2 David Remez Street, Jerusalem',
    addressHe: 'דוד רמז 2, ירושלים',
    addressRu: 'Давид Ремез 2, Иерусалим',
    location: 'jerusalem',
    coordinates: {
      latitude: 31.772,
      longitude: 35.2263,
    },
    imageUrl:
      'https://www.jerusalem.muni.il/media/w2ydyxb5/jerusalemtheater-logo.jpg',
    seatingCapacity: 400,
  },
  {
    id: 'theater-6',
    name: 'Haifa Theatre',
    nameHe: 'תיאטרון חיפה',
    nameRu: 'Театр Хайфы',
    address: '50 Pvoroslov Street, Haifa',
    addressHe: 'פברוסלוב 50, חיפה',
    addressRu: 'Февруслов 50, Хайфа',
    location: 'haifa',
    coordinates: {
      latitude: 32.8083,
      longitude: 34.9866,
    },
    imageUrl:
      'https://www.haifa.muni.il/wp-content/uploads/2021/08/taagidim.jpg',
    seatingCapacity: 550,
  },
  {
    id: 'theater-7',
    name: 'Beer Sheva Theatre',
    nameHe: 'תיאטרון באר שבע',
    nameRu: 'Театр Беэр-Шевы',
    address: '71 Rager Boulevard, Beer Sheva',
    addressHe: 'שדרות רגר 71, באר שבע',
    addressRu: 'Бульвар Рагер 71, Беэр-Шева',
    location: 'south',
    coordinates: {
      latitude: 31.2457,
      longitude: 34.7913,
    },
    imageUrl: 'https://picsum.photos/seed/beersheva/800/400',
    seatingCapacity: 450,
  },
  {
    id: 'theater-8',
    name: 'Herzliya Ensemble',
    nameHe: 'תיאטרון הרצליה אנסמבל',
    nameRu: 'Герцлийский Ансамбль',
    address: '5 Hayarkon Street, Herzliya',
    addressHe: 'הירקון 5, הרצליה',
    addressRu: 'Хаяркон 5, Герцлия',
    location: 'sharon',
    coordinates: {
      latitude: 32.1643,
      longitude: 34.8448,
    },
    imageUrl: 'https://picsum.photos/seed/herzliya/800/400',
    seatingCapacity: 350,
  },
  {
    id: 'theater-9',
    name: 'Tomix Productions',
    nameHe: 'הפקות טומיקס',
    nameRu: 'Томикс Продакшнс',
    address: 'Various venues across Israel',
    addressHe: 'אולמות שונים ברחבי הארץ',
    addressRu: 'Различные площадки по всему Израилю',
    location: 'tel_aviv',
    coordinates: {
      latitude: 32.0731,
      longitude: 34.7795,
    },
    imageUrl: 'https://www.eventer.co.il/images/tomix-logo.png',
    seatingCapacity: 500,
  },
];

// Helper function to get theater by ID
export const getTheaterById = (id: string): Theater | undefined => {
  return theaters.find((theater) => theater.id === id);
};

// Helper function to get theaters by location
export const getTheatersByLocation = (location: string): Theater[] => {
  return theaters.filter((theater) => theater.location === location);
};

// Register a dynamic theater (from API data) if it doesn't already exist
export const registerDynamicTheater = (theater: Theater): void => {
  if (!theaters.find((t) => t.id === theater.id)) {
    theaters.push(theater);
  }
};

export default theaters;
