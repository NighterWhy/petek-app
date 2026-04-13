import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ListingsService } from './listings.service';
import { S3Service } from './s3/s3.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { GetUserId } from './decorators/get-user-id.decorator';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createListing(@GetUserId() userId: string, @Body() dto: CreateListingDto) {
    return this.listingsService.createListing(userId, dto);
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('images', 5))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadPromises = files.map((file) => this.s3Service.uploadImage(file));
    const urls = await Promise.all(uploadPromises);
    return { urls };
  }
}
