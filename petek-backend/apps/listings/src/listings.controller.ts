import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ListingsService } from './listings.service';
import { S3Service } from './s3/s3.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { GetListingsDto } from './dto/get-listings.dto';
import { GetUserId } from './decorators/get-user-id.decorator';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  findAll(@Query() query: GetListingsDto) {
    return this.listingsService.findAll(query);
  }

  @Get('my-listings')
  findMyListings(@GetUserId() userId: string) {
    return this.listingsService.findMyListings(userId);
  }

  @Get('favorites')
  getFavorites(@GetUserId() userId: string) {
    return this.listingsService.getFavorites(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Post(':id/favorite')
  toggleFavorite(@GetUserId() userId: string, @Param('id') listingId: string) {
    return this.listingsService.toggleFavorite(userId, listingId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateListing(
    @GetUserId() userId: string,
    @Param('id') listingId: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.updateListing(userId, listingId, dto);
  }

  @Delete(':id')
  deleteListing(@GetUserId() userId: string, @Param('id') listingId: string) {
    return this.listingsService.deleteListing(userId, listingId);
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
