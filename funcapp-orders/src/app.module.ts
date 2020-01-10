import { Module, RequestMethod, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderService } from './order.service';
import { MtlsMiddleware } from './mtls.middleware'

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrderService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MtlsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL})
  }
}