export interface User {
  user_id: string;
  email: string;
  first_name: string;
  surname: string;
  password: string;
  created_at: string;
}

export interface Collection {
  collection_id: string;
  user_id: string;
  collection_name: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  item_id: string;
  external_id: number;
  api_source: string;
  classification: string;
  item_title: string;
  artist: string;
  thumbnail_url: string;
  full_image_url: string;
  details_url: string;
  date_created: string;
}

export interface CollectionItem {
  relationship_id: string;
  collection_id: string;
  item_id: string;
  created_at: string;
}

export type SeedData = {
  users: User[];
  userCollections: Collection[];
  items: Item[];
  collectionItems: CollectionItem[]
}