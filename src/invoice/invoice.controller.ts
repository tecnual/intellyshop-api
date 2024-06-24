import { Controller, Get, Res, UseGuards, Param, Body, Put, HttpStatus } from '@nestjs/common';
import { Invoice, InvoiceLine } from './models/invoice.schema';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { DefaultResponse } from 'src/shared/models/default-response';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Invoice')
@UseGuards(JwtAuthGuard)
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

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
    //const invoiceLine = await this.openFFService.setInvoiceProductByBarcode(body.invoiceLine.barcode, body.invoiceLine);
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
