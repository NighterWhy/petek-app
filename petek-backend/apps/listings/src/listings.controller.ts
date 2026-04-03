import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { GetUserId } from './decorators/get-user-id.decorator';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

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
}
