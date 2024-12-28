import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AddTransaccionRequest, AddTransaccionResponse } from '../../application/add-transaction.dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/core/user/user.schema';

@Injectable()
export class FireflyIIIService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService
  ) {}

  addTransaccion(addTransactionRequest: AddTransaccionRequest, user: User) {
    const token = user.firefly.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return this.http.post<AddTransaccionResponse>('https://firefly.tecnual.com/api/v1/transactions', addTransactionRequest, config);
  }

  async getAccounts(user: User, filter: string): Promise<any> {
    let query = '';
    if (filter) query = '?query=' + filter;
    const config = {
      headers: {
        Authorization: `Bearer ${user.firefly.token}`
      }
    };
    return await this.http.axiosRef.get<any>('https://firefly.tecnual.com/api/v1/autocomplete/accounts' + query, config);
  }

  async getCategories(user: User, filter: string): Promise<any> {
    let query = '';
    if (filter) query = '?query=' + filter;
    const config = {
      headers: {
        Authorization: `Bearer ${user.firefly.token}`
      }
    };
    return await this.http.axiosRef.get<any>('https://firefly.tecnual.com/api/v1/autocomplete/categories' + query, config);
  }

  async getBudgets(user: User, filter: string): Promise<any> {
    let query = '';
    if (filter) query = '?query=' + filter;
    const config = {
      headers: {
        Authorization: `Bearer ${user.firefly.token}`
      }
    };
    return await this.http.axiosRef.get<any>('https://firefly.tecnual.com/api/v1/autocomplete/budgets' + query, config);
  }

  async getTags(user: User, filter: string): Promise<any> {
    let query = '';
    if (filter) query = '?query=' + filter;
    const config = {
      headers: { Authorization: `Bearer ${user.firefly.token}` }
    };
    return await this.http.axiosRef.get<any>('https://firefly.tecnual.com/api/v1/autocomplete/tags' + query, config);
  }
}
