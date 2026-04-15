import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListingDto {
  @ApiProperty({ description: 'İlanın başlığı', example: 'Çizim Masası' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'İlanın detaylı açıklaması',
    example: 'Temiz ve kullanışlı bir çizim masası, hafif çizikler mevcut.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'İlanın kategorisi', example: 'Mobilya' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Ürünün durumu', example: 'İkinci El' })
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty({ description: 'İlanın fiyatı (TL cinsinden)', example: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'İlan bir bağış mı?', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDonation?: boolean;

  @ApiProperty({ description: 'İlanın bulunduğu şehir', example: 'İstanbul' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'İlanın bulunduğu ilçe', example: 'Kadıköy' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ description: 'İlanın bulunduğu mahalle', example: 'Moda' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ description: 'Konumun enlem koordinatı', example: 40.9923 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Konumun boylam koordinatı', example: 29.0319 })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'İlana ait görsel URL listesi',
    example: ['https://example.com/img1.jpg'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];
}
