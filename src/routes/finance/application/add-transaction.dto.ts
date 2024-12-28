import { TransactionDTO } from './transaction.dto';

export class AddTransaccionResponse {
  data: AddTransaccionData;
}

export class AddTransaccionRequest {
  apply_rules: boolean;
  fire_webhooks: boolean;
  error_if_duplicate_hash: boolean;
  group_title?: string;
  transactions: TransactionDTO[];
}

export class AddTransaccionData {
  type: string;
  id: string;
  attributes: Attributes;
  links: Links;
}

export interface Attributes {
  created_at: Date;
  updated_at: Date;
  user: string;
  group_title: string;
  transactions: TransactionDTO[];
}

export interface Links {
  '0': The0;
  self: string;
}

export interface The0 {
  rel: string;
  uri: string;
}
