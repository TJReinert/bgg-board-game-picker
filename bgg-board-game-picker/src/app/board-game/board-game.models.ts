export declare class BggCollectionDto {
  id: number;
  totalitems: number;
  pubdate: string;
  items: BggCollectionItemDto[];
}

export declare class BggCollectionItemDto {
  objectid: number;
  collid: number;
  objecttype: string;
  subtype: string;
  yearpublished: number;
  numplays: number;
  image: string;
  thumbnail: string;
  comment: string;
  wishlistcomment: string;
  name: string;
  originalname: string;
  wantpartslist: string;
  haspartslist: string;
  status: BggCollectionItemStatusDto;
  conditiontext: string;
  stats: BggCollectionItemStatsDto;
}

export declare class BggCollectionItemStatusDto {
  own: number;
  prevowned: number;
  fortrade: number;
  want: number;
  wanttoplay: number;
  wanttobuy: number;
  wishlist: number;
  wishlistpriority: number;
  preordered: number;
  lastmodified: string;
}

export declare class BggCollectionItemStatsDto {
  minplayers: number;
  maxplayers: number;
  minplaytime: number;
  maxplaytime: number;
  playingtime: number;
  numowned: number;
  rating: BggCollectionItemStatRatingDto;
}
export declare class BggCollectionItemStatRatingDto {
  value: number;
  usersrated: number;
  average: number;
  bayesaverage: number;
  stddev: number;
  median: number;
  ranks: BggCollectionItemStatRatingRanksDto[];
}
export declare class BggCollectionItemStatRatingRanksDto {
  type: string;
  id: number;
  name: string;
  friendlyname: string;
  value: number;
  bayesaverage: number;
}
