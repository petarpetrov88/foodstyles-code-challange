import { ApiPropertyOptional } from '@nestjs/swagger';
import { City } from '../../../entities/city.entity';
import { Brand } from '../../../entities/brand.entity';
import { DishType } from '../../../entities/dishType.entity';
import { Diet } from '../../../entities/diet.entity';

export class SearchResultDto {
  @ApiPropertyOptional()
  city?: City;
  @ApiPropertyOptional()
  brand?: Brand;
  @ApiPropertyOptional()
  dishType?: DishType;
  @ApiPropertyOptional()
  diet?: Diet;
}
