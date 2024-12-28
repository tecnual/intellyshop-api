export class TransactionDTO {
  type: TransactionType;
  description: string;
  date: string;
  amount: string;
  order?: number;
  currency_id?: string;
  currency_code?: string;
  budget_id?: string;
  category_id?: string;
  source_id: string;
  destination_id: string;
  tags?: string[];
  external_id?: string;
  invoice_date?: string;
}

export enum TransactionType {
  WITHDRAWAL = 'withdrawal',
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
  RECONCILIATION = 'reconciliation',
  OPENING_BALANCE = 'opening balance'
}
