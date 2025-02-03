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
  relationship_id: string;
  collection_id: string;
  external_id: number;
  api_source: string;
  created_at: string;
}

export type SeedData = {
  users: User[];
  userCollections: Collection[];
  collectionItems: CollectionItem[];
};
