import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order-create.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly appService: OrderService) {}

  @Get()
  getOrders(): string {
    return this.appService.getOrders();
  }

  @Get(':id')
  getOrder(@Param('id') id: number): string {
    return this.appService.getOrder(id);
  }

  @Post()
  @ApiBody({ type: [CreateOrderDto]})
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.appService.createOrder();
  }

}