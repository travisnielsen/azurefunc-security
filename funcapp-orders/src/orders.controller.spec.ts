import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrderService } from './order.service';

describe('AppController', () => {
  let appController: OrdersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrderService],
    }).compile();

    appController = app.get<OrdersController>(OrdersController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getOrders()).toBe('Orders here');
    });
  });
});
