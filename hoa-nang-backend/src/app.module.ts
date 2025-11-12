import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenusModule } from './menus/menus.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { FeedbackModule } from './feedback/feedback.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [AuthModule, UsersModule, MenusModule, OrdersModule, PaymentsModule, FeedbackModule, DeliveriesModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
