import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('products')
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }
}
