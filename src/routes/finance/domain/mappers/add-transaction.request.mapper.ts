import { Invoice } from 'src/invoice/models/invoice.schema';
import { AddTransaccionRequest } from '../../../../routes/finance/application/add-transaction.dto';
import { TransactionDTO, TransactionType } from '../../../../routes/finance/application/transaction.dto';

export class AddTransactionRequestMapper {
  // Convierte una entidad del dominio a un DTO
  invoiceToTransacction(invoice: Invoice, firefly): AddTransaccionRequest {
    const addTransaccionRequest = new AddTransaccionRequest();
    addTransaccionRequest.error_if_duplicate_hash = true;
    addTransaccionRequest.apply_rules = true;
    addTransaccionRequest.fire_webhooks = true;
    const transactionDTO = new TransactionDTO();
    transactionDTO.amount = String(invoice.total);
    transactionDTO.type = TransactionType.WITHDRAWAL;
    transactionDTO.description = 'Compra en ' + invoice.invoiceType;
    transactionDTO.budget_id = firefly.budget.id!;
    transactionDTO.category_id = firefly.category.id!;
    transactionDTO.currency_code = 'EUR'; // TODO: Obtener del ticket
    transactionDTO.currency_id = '1';
    transactionDTO.date = invoice.date.toISOString();
    transactionDTO.destination_id = firefly.destinationAccount.id!;
    transactionDTO.source_id = firefly.sourceAccount.id!;
    transactionDTO.external_id = String(invoice.number);
    transactionDTO.invoice_date = invoice.date.toISOString();
    transactionDTO.tags = firefly.tags;
    addTransaccionRequest.transactions = [transactionDTO];
    return addTransaccionRequest;
  }
}
