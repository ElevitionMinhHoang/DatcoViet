import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileUploadService } from '../file-upload/file-upload.service';

@ApiTags('menus')
@Controller('menus')
export class MenusController {
  constructor(
    private readonly menusService: MenusService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  private static readonly fileUploadConfig = {
    storage: diskStorage({
      destination: './uploads/menus',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `menu-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return callback(new BadRequestException('Chỉ chấp nhận file ảnh PNG hoặc JPG'), false);
      }
      callback(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
  };

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image', MenusController.fileUploadConfig))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'Menu item successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid file type or size.' })
  create(
    @Body() createMenuDto: CreateMenuDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Received menu creation request:', createMenuDto);
    console.log('File uploaded:', file ? file.filename : 'No file');
    
    try {
      // If file is uploaded, update the image URL
      if (file) {
        const imageUrl = `/uploads/menus/${file.filename}`;
        createMenuDto.image = imageUrl;
        console.log('Image URL set to:', imageUrl);
      } else if (!createMenuDto.image) {
        // Use default placeholder if no image provided
        createMenuDto.image = 'https://via.placeholder.com/300x200?text=No+Image';
        console.log('Using default placeholder image');
      }

      // Set default isActive if not provided
      if (createMenuDto.isActive === undefined) {
        createMenuDto.isActive = true;
      }

      console.log('Final menu data:', createMenuDto);
      const result = this.menusService.create(createMenuDto);
      console.log('Menu created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all active menu items' })
  @ApiResponse({ status: 200, description: 'Menu items successfully retrieved.' })
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.menusService.search(search);
    }
    return this.menusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific menu item' })
  @ApiResponse({ status: 200, description: 'Menu item successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menusService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a menu item' })
  @ApiResponse({ status: 200, description: 'Menu item successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiResponse({ status: 200, description: 'Menu item successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menusService.remove(id);
  }
}
