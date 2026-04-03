import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
    });
  }

  async createListing(userId: string, dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        condition: dto.condition,
        price: dto.price,
        isDonation: dto.isDonation ?? false,
        city: dto.city,
        district: dto.district,
        neighborhood: dto.neighborhood,
        latitude: dto.latitude,
        longitude: dto.longitude,
        imageUrls: dto.imageUrls ?? [],
        userId,
      },
    });
  }
}
