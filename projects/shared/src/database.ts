// Database entity interfaces based on the PlantUML schema

export interface User {
  user_id: number;
  name: string;
  description?: string;
}

export interface Card {
  card_id: number;
  sync_enabled: boolean;
  version: number;
  last_sync_version: number;
  user_id: number;
  other_details?: string;
}

export interface CardHistory {
  card_history_id: number;
  version: number;
  card_id: number;
  other_details?: string;
}

export interface Account {
  account_id: number;
  user_id?: number;
  other_details?: string;
}

export interface CardsAccounts {
  id: number;
  card_id?: number;
  account_id?: number;
  other_details?: string;
}

export interface Stream {
  id: number;
  version: number;
  searchingText: string;
  owner_id?: number;
  follower_id?: number;
  card_id?: number;
  other_details?: string;
}

// Input types for creating new records (without auto-generated IDs)
export interface CreateUserInput {
  name: string;
  description?: string;
}

export interface CreateCardInput {
  sync_enabled: boolean;
  version: number;
  last_sync_version: number;
  user_id: number;
  other_details?: string;
}

export interface CreateCardHistoryInput {
  version: number;
  card_id: number;
  other_details?: string;
}

export interface CreateAccountInput {
  user_id?: number;
  other_details?: string;
}

export interface CreateCardsAccountsInput {
  card_id?: number;
  account_id?: number;
  other_details?: string;
}

export interface CreateStreamInput {
  version: number;
  searchingText: string;
  owner_id?: number;
  follower_id?: number;
  card_id?: number;
  other_details?: string;
}
