export interface User {
  user_id: number;
  email: string;
  first_name: string;
  surname: string;
  password: string;
  created_at: string;
}

export interface Collection {
  collection_id: string;
  user_id: number;
  collection_name: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  external_id: number;
  api_source: string;
  item_title: string;
  artist: string;
  image_url: string;
  item_created_at: string;
  added_at: string;
}

export type SeedData = {
  users: User[];
  userCollections: Collection[];
  collectionItems: CollectionItem[];
};
