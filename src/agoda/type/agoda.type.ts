export interface AgodaPriceResult {
  cid: number;
  label: string;
  price: number | null;
  hotelName: string | null;
  url: string;
  error?: boolean;
}

export const CID_LIST = [
  { cid: 28280, label: '구글' },
  { cid: 1833982, label: '구글' },
  { cid: 1917614, label: '구글' },
  { cid: 1833981, label: '구글' },
  { cid: 1908617, label: '구글' },
  { cid: 1922868, label: '구글' },
  { cid: 1922847, label: '구글' },
  { cid: 1891504, label: '네이버' },
  { cid: 1563295, label: '국민카드' },
  { cid: 1783115, label: '삼성카드' },
  { cid: 1760133, label: '신한카드' },
  { cid: 1654104, label: '우리카드' },
  { cid: 1641446, label: '현대카드' },
  { cid: 1827579, label: '농협카드' },
  { cid: 1748498, label: 'BC카드' },
  { cid: 1917334, label: '토스카드' },
  { cid: 1729471, label: '하나카드' },
  { cid: 1917349, label: '트레블월렛' },
  { cid: 1845109, label: '카카오페이' },
  { cid: 1845157, label: '페이코' },
  { cid: 1889319, label: '비자카드' },
  { cid: 1889572, label: '마스터카드' },
  { cid: 1801110, label: '유니온페이' },
  { cid: 1904827, label: '대한항공' },
];
