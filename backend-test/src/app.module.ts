import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { ProductsModule } from './products/products.module';
import { VendorsModule } from './vendors/vendors.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    VendorsModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
