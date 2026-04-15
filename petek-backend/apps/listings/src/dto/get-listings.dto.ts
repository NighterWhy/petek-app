import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetListingsDto {
  @ApiProperty({ description: 'Kategori filtresi', example: 'Mobilya', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Şehir filtresi', example: 'İstanbul', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'İlçe filtresi', example: 'Kadıköy', required: false })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({ description: 'Sadece bağış ilanlarını getir', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isDonation?: boolean;

  @ApiProperty({ description: 'Başlık veya açıklamada arama terimi', example: 'masa', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Sayfa numarası (1\'den başlar)', example: 1, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: 'Sayfa başına döndürülecek ilan sayısı', example: 20, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
