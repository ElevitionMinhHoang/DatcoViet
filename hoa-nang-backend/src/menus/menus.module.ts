import { Module } from '@nestjs/common';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { PrismaService } from '../prisma.service';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { FileUploadService } from '../file-upload/file-upload.service';

@Module({
  imports: [FileUploadModule],
  controllers: [MenusController],
  providers: [MenusService, PrismaService, FileUploadService],
})
export class MenusModule {}
