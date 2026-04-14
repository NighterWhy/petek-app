import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { GetListingsDto } from './dto/get-listings.dto';

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(dto: GetListingsDto) {
    const { category, city, district, isDonation, search, page = 1, limit = 20 } = dto;

    const cacheKey = [
      'listings',
      `page${page}`,
      `limit${limit}`,
      category ? `cat_${category}` : '',
      city ? `city_${city}` : '',
      district ? `dist_${district}` : '',
      isDonation !== undefined ? `donation_${isDonation}` : '',
      search ? `q_${search}` : '',
    ]
      .filter(Boolean)
      .join('_');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const where: Prisma.ListingWhereInput = {};

    if (category !== undefined) where.category = category;
    if (city !== undefined) where.city = city;
    if (district !== undefined) where.district = district;
    if (isDonation !== undefined) where.isDonation = isDonation;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.listing.count({ where }),
    ]);

    const result = {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.cacheManager.set(cacheKey, result);

    return result;
  }

  async findOne(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
    });
  }

  async toggleFavorite(userId: string, listingId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });

    if (existing) {
      await this.prisma.$transaction([
        this.prisma.favorite.delete({
          where: { userId_listingId: { userId, listingId } },
        }),
        this.prisma.listing.update({
          where: { id: listingId },
          data: { favoriteCount: { decrement: 1 } },
        }),
      ]);
      return { status: 'removed' as const, listingId };
    }

    await this.prisma.$transaction([
      this.prisma.favorite.create({
        data: { userId, listingId },
      }),
      this.prisma.listing.update({
        where: { id: listingId },
        data: { favoriteCount: { increment: 1 } },
      }),
    ]);
    return { status: 'added' as const, listingId };
  }

  async getFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: { listing: true },
      orderBy: { createdAt: 'desc' },
    });
    return favorites.map((f) => f.listing);
  }

  async findMyListings(userId: string) {
    return this.prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateListing(userId: string, listingId: string, dto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: { ...dto },
    });

    await this.cacheManager.clear();

    return updated;
  }

  async deleteListing(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.prisma.listing.delete({ where: { id: listingId } });
    await this.cacheManager.clear();
    return { message: 'Listing deleted successfully' };
  }

  async createListing(userId: string, dto: CreateListingDto) {
    const newListing = await this.prisma.listing.create({
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
      include: {
        user: {
          select: { email: true, fullName: true },
        },
      },
    });

    this.client.emit('listing_created', newListing);
    await this.cacheManager.clear();

    return newListing;
  }
}
