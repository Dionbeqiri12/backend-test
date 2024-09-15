import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from '../schemas/vendor.schema';

@Injectable()
export class VendorsService {
  constructor(@InjectModel('Vendor') private vendorModel: Model<Vendor>) {}

  async findOrCreate(name: string): Promise<Vendor> {
    let vendor = await this.vendorModel.findOne({ name }).exec();
    if (!vendor) {
      vendor = new this.vendorModel({ name });
      await vendor.save();
    }
    return vendor;
  }
}
