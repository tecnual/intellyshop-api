import { TransactionType } from '../../../routes/finance/application/transaction.dto';

export class Transaction {
  type: TransactionType;
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
  external_id?: string[];
  invoice_date?: string[];
}
