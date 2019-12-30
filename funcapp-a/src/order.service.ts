import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  getOrders(): string {
    return 'Orders here';
  }

  getOrder(id: number): string {
    return `This action returns order: #${id}`;
  }

  createOrder(): string {
    return 'Order created';
  }

}
