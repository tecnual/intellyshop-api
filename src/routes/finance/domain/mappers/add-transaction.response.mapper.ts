import { Mapper } from 'src/shared/mappers/mapper';
import { AddTransaccionRequest } from '../../../../routes/finance/application/add-transaction.dto';
import { Invoice } from 'src/invoice/models/invoice.schema';
import { TransactionDTO } from '../../../../routes/finance/application/transaction.dto';

export class AddTransactionResponseMapper implements Mapper<Invoice, AddTransaccionRequest> {
  // Convierte una entidad del dominio a un DTO
  mapFrom(invoice: Invoice): AddTransaccionRequest {
    const transactionRequest = new AddTransaccionRequest();
    transactionRequest.apply_rules = true;
    const transaction = new TransactionDTO();
    transaction.amount = invoice.total.toString();
    transaction.description = 'Compra en Mercadona';
    transaction.date = invoice.date.toISOString();
    transactionRequest.transactions = [transaction];
    transaction.tags = ['Mercadona', 'Supermercado', 'Alimentación'];
    return transactionRequest;
  }

  // Convierte un DTO a una entidad del dominio
  mapTo(transaction: AddTransaccionRequest): Invoice {
    const invoice = new Invoice('1', null, null, null, null, null, null, null);
    return invoice;
  }
}
