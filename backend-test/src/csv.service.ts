import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CsvParser, ParsedData } from 'nest-csv-parser'; 
import { SchedulerRegistry } from '@nestjs/schedule';
import { Product } from './schemas/product.schema';
import { VendorsService } from './vendors/vendors.service';
import { nanoid } from 'nanoid';
import * as fs from 'fs';

@Injectable()
export class CsvService {
  constructor(
    @InjectModel('Product') private productModel: Model<Product>, 
    private readonly vendorsService: VendorsService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly csvParser: CsvParser, 
  ) { }
    
  onModuleInit() {
    const importJob = this.schedulerRegistry.getCronJob('dailyImportJob');
    importJob.start();
  }


  async importCsvData() {
    const csvFilePath = '/Users/dionbeqiri/Desktop/sample-products.csv';
    const parsedData: ParsedData<any> = await this.parseCsvFile(csvFilePath);

    const products = parsedData.list; 

    for (const product of products) {
      await this.checkAndUpdateVendors(product);
      await this.upsertProduct(product);
    }

    await this.enhanceDescriptions();
  }

 
  async parseCsvFile(filePath: string): Promise<ParsedData<any>> {
   
    const stream = fs.createReadStream(filePath); 
    return this.csvParser.parse(stream, null);
  }

  
  async checkAndUpdateVendors(product: any) {
    const vendorId = await this.vendorsService.findOrCreate(product.vendorName);
    const manufacturerId = await this.vendorsService.findOrCreate(
      product.manufacturerName,
    );
    product.vendorId = vendorId;
    product.manufacturerId = manufacturerId;
  }

  
  async upsertProduct(product: any) {
    const productId = product.ProductID;
    const docId = nanoid(); 


    await this.productModel.updateOne(
      { ProductID: productId },
      { $set: { ...product, docId } }, 
      { upsert: true },
    );
  }


  async enhanceDescriptions() {
    const products = await this.productModel.find({}).limit(10); 
    for (const product of products) {
      const enhancedDescription = await this.runDescriptionEnhancement(product);
      product.description = enhancedDescription;
      await product.save();
    }
  }

  // GPT-4 prompt to enhance the description
  async runDescriptionEnhancement(product: any): Promise<string> {
    const prompt = `
      You are an expert in medical sales. Your specialty is medical consumables used by hospitals on a daily basis.
      Enhance the description of a product based on the information provided.

      Product name: ${product.name}
      Product description: ${product.description}
      Category: ${product.category}

      New Description:
    `;

    // Simulate GPT-4 API call (replace this with actual GPT-4 integration)
    const enhancedDescription = `Enhanced description for ${product.name}`;
    return enhancedDescription;
  }
}
