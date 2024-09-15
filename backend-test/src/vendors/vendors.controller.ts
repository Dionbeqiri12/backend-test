import { Controller, Get, Param } from '@nestjs/common';
import { VendorsService } from './vendors.service';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get(':name')
  async findOrCreate(@Param('name') name: string) {
    return this.vendorsService.findOrCreate(name);
  }
}
