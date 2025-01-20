import { Controller, Get, Res, UseGuards, Param, Body, Put, HttpStatus } from '@nestjs/common';
import { Invoice, InvoiceLine } from './models/invoice.schema';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { DefaultResponse } from 'src/shared/models/default-response.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Invoice')
@UseGuards(JwtAuthGuard)
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  /**
   * This function sets an invoice line for a specific invoice and returns the updated invoice line.
   * @param {any} body - The `body` parameter in the `setInvoiceLine` function represents the request
   * body that contains data to be used for setting an invoice line. It is typically sent as part of the
   * HTTP request when calling this function. The `@Body()` decorator is used in NestJS to extract and
   * inject the
   * @param {string} invoiceId - The `invoiceId` parameter in the `setInvoiceLine` function represents
   * the unique identifier of the invoice to which the invoice line will be added or updated. It is used
   * to retrieve the specific invoice from the database before setting the invoice line.
   * @param {string} lineId - The `lineId` parameter in the `setInvoiceLine` function represents the
   * unique identifier of a specific line within an invoice. It is used to identify the particular line
   * that needs to be updated or modified when setting an invoice line.
   * @param res - The `res` parameter in the `setInvoiceLine` method is used to send the HTTP response
   * back to the client. In this case, it is being used to send either a success response with the
   * updated `InvoiceLine` object or a not found response with an error message if the invoice is
   * @returns The `setInvoiceLine` method is returning a Promise that resolves to an `InvoiceLine`
   * object. If the invoice is found, it sets the invoice line and returns a success response with the
   * updated invoice line. If the invoice is not found, it returns a 404 Not Found response with an error
   * message indicating that the invoice was not found.
   */
  @Put('/:invoiceId/line/:lineId')
  async setInvoiceLine(
    @Body() body: any,
    @Param('invoiceId') invoiceId: string,
    @Param('lineId') lineId: string,
    @Res() res
  ): Promise<InvoiceLine> {
    const invoice = await this.invoiceService.getInvoiceById(invoiceId);
    if (invoice) {
      const invoiceLine = await this.invoiceService.setInvoiceLine(invoice, body.invoiceLine);
      return res.status(HttpStatus.OK).send(new DefaultResponse<InvoiceLine>(invoiceLine));
    } else {
      return res.status(HttpStatus.NOT_FOUND).send(new DefaultResponse(null, [{ code: 'IS005404', message: 'Factura no encontrada' }]));
    }
  }
  @ApiResponse({
    status: 200,
    description: 'Obtain invoice by Id',
    type: Invoice
  })
  @Get('/:invoiceId')
  async getInvoice(@Param('invoiceId') invoiceId: string): Promise<Invoice> {
    return this.invoiceService.getInvoiceById(invoiceId);
  }
}
