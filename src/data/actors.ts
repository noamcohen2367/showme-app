// ============================================
// ShowME App - Dummy Data: Actors
// ============================================

import { Actor } from '../types/types';

export const actors: Actor[] = [
  {
    id: 'actor-1',
    name: 'Avi Kushnir',
    nameHe: 'אבי קושניר',
    nameRu: 'Ави Кушнир',
    bio: 'Award-winning Israeli actor known for his versatile performances in theater and film.',
    bioHe: 'שחקן ישראלי מפורסם הידוע בהופעות המגוונות שלו בתיאטרון ובקולנוע.',
    bioRu: 'Израильский актер, известный своими разнообразными выступлениями в театре и кино.',
    imageUrl: 'https://picsum.photos/seed/actor1/400/400',
    photos: [
      'https://picsum.photos/seed/actor1-1/600/400',
      'https://picsum.photos/seed/actor1-2/600/400',
      'https://picsum.photos/seed/actor1-3/600/400',
    ],
    showIds: ['show-1', 'show-5'],
  },
  {
    id: 'actor-2',
    name: 'Maya Dagan',
    nameHe: 'מאיה דגן',
    nameRu: 'Майя Даган',
    bio: 'Celebrated actress with over 20 years of experience in Israeli theater.',
    bioHe: 'שחקנית מוערכת עם מעל 20 שנות ניסיון בתיאטרון הישראלי.',
    bioRu: 'Известная актриса с более чем 20-летним опытом работы в израильском театре.',
    imageUrl: 'https://picsum.photos/seed/actor2/400/400',
    photos: [
      'https://picsum.photos/seed/actor2-1/600/400',
      'https://picsum.photos/seed/actor2-2/600/400',
    ],
    showIds: ['show-2', 'show-3', 'show-7'],
  },
  {
    id: 'actor-3',
    name: 'Doron Tavori',
    nameHe: 'דורון טבורי',
    nameRu: 'Дорон Тавори',
    bio: 'One of Israel\'s most respected actors, known for dramatic roles.',
    bioHe: 'אחד השחקנים המוערכים בישראל, ידוע בתפקידים דרמטיים.',
    bioRu: 'Один из самых уважаемых актеров Израиля, известный драматическими ролями.',
    imageUrl: 'https://picsum.photos/seed/actor3/400/400',
    photos: [
      'https://picsum.photos/seed/actor3-1/600/400',
      'https://picsum.photos/seed/actor3-2/600/400',
      'https://picsum.photos/seed/actor3-3/600/400',
      'https://picsum.photos/seed/actor3-4/600/400',
    ],
    showIds: ['show-1', 'show-6'],
  },
  {
    id: 'actor-4',
    name: 'Noa Koler',
    nameHe: 'נועה קולר',
    nameRu: 'Ноа Колер',
    bio: 'Rising star of Israeli theater, combining comedy and drama with ease.',
    bioHe: 'כוכבת עולה של התיאטרון הישראלי, משלבת קומדיה ודרמה בקלות.',
    bioRu: 'Восходящая звезда израильского театра, легко сочетающая комедию и драму.',
    imageUrl: 'https://picsum.photos/seed/actor4/400/400',
    photos: [
      'https://picsum.photos/seed/actor4-1/600/400',
    ],
    showIds: ['show-3', 'show-4', 'show-8'],
  },
  {
    id: 'actor-5',
    name: 'Shlomo Bar-Aba',
    nameHe: 'שלמה בראבא',
    nameRu: 'Шломо Бар-Аба',
    bio: 'Legendary actor known for his iconic roles in Israeli cinema and theater.',
    bioHe: 'שחקן אגדי הידוע בתפקידיו האיקוניים בקולנוע ובתיאטרון הישראלי.',
    bioRu: 'Легендарный актер, известный своими культовыми ролями в израильском кино и театре.',
    imageUrl: 'https://picsum.photos/seed/actor5/400/400',
    photos: [
      'https://picsum.photos/seed/actor5-1/600/400',
      'https://picsum.photos/seed/actor5-2/600/400',
    ],
    showIds: ['show-2', 'show-5'],
  },
  {
    id: 'actor-6',
    name: 'Efrat Ben Zur',
    nameHe: 'אפרת בן צור',
    nameRu: 'Эфрат Бен Цур',
    bio: 'Versatile actress acclaimed for both musical and dramatic performances.',
    bioHe: 'שחקנית רב-תחומית המוכרת בהופעותיה המוזיקליות והדרמטיות.',
    bioRu: 'Разносторонняя актриса, признанная за музыкальные и драматические выступления.',
    imageUrl: 'https://picsum.photos/seed/actor6/400/400',
    photos: [
      'https://picsum.photos/seed/actor6-1/600/400',
      'https://picsum.photos/seed/actor6-2/600/400',
      'https://picsum.photos/seed/actor6-3/600/400',
    ],
    showIds: ['show-4', 'show-6', 'show-7'],
  },
  {
    id: 'actor-7',
    name: 'Yehuda Levi',
    nameHe: 'יהודה לוי',
    nameRu: 'Йехуда Леви',
    bio: 'Popular actor known for his charismatic performances and leading roles.',
    bioHe: 'שחקן פופולרי הידוע בהופעותיו הכריזמטיות ובתפקידים ראשיים.',
    bioRu: 'Популярный актер, известный харизматичными выступлениями и главными ролями.',
    imageUrl: 'https://picsum.photos/seed/actor7/400/400',
    photos: [
      'https://picsum.photos/seed/actor7-1/600/400',
    ],
    showIds: ['show-8', 'show-9'],
  },
  {
    id: 'actor-8',
    name: 'Hani Furstenberg',
    nameHe: 'האני פורסטנברג',
    nameRu: 'Хани Фюрстенберг',
    bio: 'International actress with experience in both Israeli and European theater.',
    bioHe: 'שחקנית בינלאומית עם ניסיון בתיאטרון ישראלי ואירופי.',
    bioRu: 'Международная актриса с опытом работы в израильском и европейском театре.',
    imageUrl: 'https://picsum.photos/seed/actor8/400/400',
    photos: [
      'https://picsum.photos/seed/actor8-1/600/400',
      'https://picsum.photos/seed/actor8-2/600/400',
    ],
    showIds: ['show-9', 'show-10'],
  },
];

// Helper function to get actor by ID
export const getActorById = (id: string): Actor | undefined => {
  return actors.find(actor => actor.id === id);
};

// Helper function to get actors by show ID
export const getActorsByShowId = (showId: string): Actor[] => {
  return actors.filter(actor => actor.showIds.includes(showId));
};

export default actors;
