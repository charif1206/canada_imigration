import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogsService } from './blogs.service';
import { CreatePostDto, UpdatePostDto, QueryPostDto } from './dto';
import {
  BlogPostResponse,
  BlogPostWithLikeStatus,
  PaginatedBlogsResponse,
  DeleteBlogResponse,
} from './interfaces/blog.interface';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { MAX_IMAGE_SIZE } from './constants/blog.constants';

/**
 * Blog Posts Controller
 * Handles HTTP requests and delegates business logic to service
 * Follows Single Responsibility Principle - only handles request/response
 */
@Controller('posts')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // ========================================
  // PUBLIC ENDPOINTS
  // ========================================

  /**
   * GET /posts/published
   * Fetch all published blog posts (public access)
   */
  @Get('published')
  @HttpCode(HttpStatus.OK)
  async findPublished(
    @Query() query: QueryPostDto,
  ): Promise<PaginatedBlogsResponse> {
    return this.blogsService.findPublished(query);
  }

  /**
   * GET /posts/:id
   * Fetch a single blog post by ID (public access)
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<BlogPostResponse> {
    return this.blogsService.findOne(id);
  }

  // ========================================
  // ADMIN ENDPOINTS
  // ========================================

  /**
   * GET /posts
   * Fetch all posts including drafts (admin/moderator only)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryPostDto): Promise<PaginatedBlogsResponse> {
    return this.blogsService.findAll(query);
  }

  /**
   * POST /posts
   * Create a new blog post with image (admin/moderator only)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
  ): Promise<BlogPostResponse> {
    return this.blogsService.create(createPostDto, image);
  }

  /**
   * PUT /posts/:id
   * Update an existing blog post (admin/moderator only)
   * Image is optional for updates
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|gif|webp)$/ }),
        ],
        fileIsRequired: false, // Image is optional for updates
      }),
    )
    image?: Express.Multer.File,
  ): Promise<BlogPostResponse> {
    return this.blogsService.update(id, updatePostDto, image);
  }

  /**
   * DELETE /posts/:id
   * Delete a blog post (admin/moderator only)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<DeleteBlogResponse> {
    return this.blogsService.remove(id);
  }

  // ========================================
  // AUTHENTICATED USER ENDPOINTS
  // ========================================

  /**
   * POST /posts/:id/like
   * Toggle like/unlike on a blog post (authenticated users)
   */
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async toggleLike(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ): Promise<BlogPostWithLikeStatus> {
    return this.blogsService.toggleLike(id, userId);
  }
}
