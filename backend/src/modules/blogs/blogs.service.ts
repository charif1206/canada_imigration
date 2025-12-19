import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreatePostDto, UpdatePostDto, QueryPostDto } from './dto';
import {
  BlogPostResponse,
  BlogPostWithLikeStatus,
  PaginatedBlogsResponse,
  DeleteBlogResponse,
} from './interfaces/blog.interface';
import {
  parsePaginationOptions,
  calculatePaginationMetadata,
} from './helpers/pagination.helper';
import {
  transformPostToResponse,
  transformPostWithLikeStatus,
  toggleUserLike,
} from './helpers/blog-post.helper';
import { validateImageFile } from './helpers/image-validation.helper';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, CLOUDINARY_FOLDER } from './constants/blog.constants';

/**
 * Service for managing blog posts
 * Follows Single Responsibility Principle - focuses on business logic
 * Uses dependency injection for loose coupling
 */
@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ========================================
  // CREATE OPERATION
  // ========================================

  /**
   * Create a new blog post with image upload
   * @throws BadRequestException if image is missing or invalid
   * @throws InternalServerErrorException if creation fails
   */
  async create(
    createPostDto: CreatePostDto,
    imageFile: Express.Multer.File,
  ): Promise<BlogPostResponse> {
    try {
      this.logger.log(`Creating new blog post: ${createPostDto.title}`);

      // Validate image file
      validateImageFile(imageFile);

      // Upload image to Cloudinary
      const imageUrl = await this.uploadImage(imageFile);

      // Create post in database
      const post = await this.createPostInDatabase(createPostDto, imageUrl);

      this.logger.log(`Blog post created successfully: ${post.id}`);

      return transformPostToResponse(post);
    } catch (error) {
      this.handleError('create blog post', error);
    }
  }

  // ========================================
  // READ OPERATIONS
  // ========================================

  /**
   * Get all blog posts with optional filtering (Admin view)
   * @returns Paginated list of all posts
   */
  async findAll(queryDto: QueryPostDto): Promise<PaginatedBlogsResponse> {
    try {
      const { page, limit, skip } = parsePaginationOptions(
        queryDto.page,
        queryDto.limit,
      );

      // Build filter conditions
      const where = this.buildWhereClause(queryDto.published);

      // Fetch posts and count in parallel
      const [posts, total] = await this.fetchPostsWithCount(where, skip, limit);

      // Calculate pagination metadata
      const pagination = calculatePaginationMetadata(total, page, limit);

      return {
        posts: posts.map(transformPostToResponse),
        pagination,
      };
    } catch (error) {
      this.handleError('fetch blog posts', error);
    }
  }

  /**
   * Get only published blog posts (Public view)
   * @returns Paginated list of published posts
   */
  async findPublished(queryDto: QueryPostDto): Promise<PaginatedBlogsResponse> {
    try {
      const { page, limit, skip } = parsePaginationOptions(
        queryDto.page,
        queryDto.limit,
      );

      const where = { published: true };

      // Fetch posts and count in parallel
      const [posts, total] = await this.fetchPostsWithCount(where, skip, limit);

      // Calculate pagination metadata
      const pagination = calculatePaginationMetadata(total, page, limit);

      return {
        posts: posts.map(transformPostToResponse),
        pagination,
      };
    } catch (error) {
      this.handleError('fetch published posts', error);
    }
  }

  /**
   * Get a single blog post by ID
   * @throws NotFoundException if post not found
   */
  async findOne(id: string): Promise<BlogPostResponse> {
    try {
      const post = await this.findPostById(id);
      return transformPostToResponse(post);
    } catch (error) {
      this.handleError('fetch blog post', error);
    }
  }

  // ========================================
  // UPDATE OPERATION
  // ========================================

  /**
   * Update a blog post with optional image replacement
   * @throws NotFoundException if post not found
   * @throws InternalServerErrorException if update fails
   */
  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    imageFile?: Express.Multer.File,
  ): Promise<BlogPostResponse> {
    try {
      this.logger.log(`Updating blog post: ${id}`);

      // Check if post exists
      const existingPost = await this.findPostById(id);

      // Handle image replacement if provided
      const updateData = await this.prepareUpdateData(
        updatePostDto,
        imageFile,
        existingPost.imgUrl,
      );

      // Update post in database
      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: updateData,
      });

      this.logger.log(`Blog post updated successfully: ${id}`);

      return transformPostToResponse(updatedPost);
    } catch (error) {
      this.handleError('update blog post', error);
    }
  }

  // ========================================
  // DELETE OPERATION
  // ========================================

  /**
   * Delete a blog post and its associated image
   * @throws NotFoundException if post not found
   */
  async remove(id: string): Promise<DeleteBlogResponse> {
    try {
      this.logger.log(`Deleting blog post: ${id}`);

      // Check if post exists
      const post = await this.findPostById(id);

      // Delete image from Cloudinary
      await this.deletePostImage(post.imgUrl);

      // Delete post from database
      await this.prisma.post.delete({ where: { id } });

      this.logger.log(`Blog post deleted successfully: ${id}`);

      return {
        message: SUCCESS_MESSAGES.POST_DELETED,
        id,
      };
    } catch (error) {
      this.handleError('delete blog post', error);
    }
  }

  // ========================================
  // LIKE FUNCTIONALITY
  // ========================================

  /**
   * Toggle like/unlike on a blog post
   * @throws NotFoundException if post not found
   */
  async toggleLike(id: string, userId: string): Promise<BlogPostWithLikeStatus> {
    try {
      this.logger.log(`Toggling like on post ${id} by user ${userId}`);

      // Check if post exists
      const post = await this.findPostById(id);

      // Toggle user's like
      const updatedLikes = toggleUserLike(post.likes, userId);
      const action = updatedLikes.length > post.likes.length ? 'liked' : 'unliked';

      // Update post with new likes
      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: { likes: updatedLikes },
      });

      this.logger.log(`User ${userId} ${action} post ${id}`);

      return transformPostWithLikeStatus(updatedPost, userId);
    } catch (error) {
      this.handleError('toggle like', error);
    }
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Find post by ID or throw NotFoundException
   */
  private async findPostById(id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException(
        ERROR_MESSAGES.POST_NOT_FOUND.replace('{id}', id),
      );
    }

    return post;
  }

  /**
   * Build where clause for filtering posts
   */
  private buildWhereClause(published?: string): any {
    const where: any = {};

    if (published !== undefined) {
      where.published = published === 'true';
    }

    return where;
  }

  /**
   * Fetch posts and count in parallel
   */
  private async fetchPostsWithCount(
    where: any,
    skip: number,
    limit: number,
  ): Promise<[Post[], number]> {
    return Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);
  }

  /**
   * Upload image to Cloudinary and return secure URL
   */
  private async uploadImage(imageFile: Express.Multer.File): Promise<string> {
    const uploadResult = await this.cloudinaryService.uploadFromBuffer(
      imageFile.buffer,
      CLOUDINARY_FOLDER,
      imageFile.originalname,
    );

    if (!('secure_url' in uploadResult)) {
      throw new InternalServerErrorException(ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
    }

    return uploadResult.secure_url;
  }

  /**
   * Create post in database
   */
  private async createPostInDatabase(
    createPostDto: CreatePostDto,
    imageUrl: string,
  ): Promise<Post> {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        imgUrl: imageUrl,
        published: createPostDto.published ?? true,
        likes: [],
      },
    });
  }

  /**
   * Prepare update data with optional image replacement
   */
  private async prepareUpdateData(
    updatePostDto: UpdatePostDto,
    imageFile: Express.Multer.File | undefined,
    currentImageUrl: string,
  ): Promise<any> {
    const updateData: any = { ...updatePostDto };

    if (imageFile) {
      // Upload new image
      updateData.imgUrl = await this.uploadImage(imageFile);

      // Delete old image
      await this.deletePostImage(currentImageUrl);
    }

    return updateData;
  }

  /**
   * Delete post image from Cloudinary
   */
  private async deletePostImage(imageUrl: string): Promise<void> {
    const publicId = this.cloudinaryService.extractPublicId(imageUrl);
    
    if (publicId) {
      await this.cloudinaryService.deleteFile(publicId);
      this.logger.log(`Image deleted from Cloudinary: ${publicId}`);
    }
  }

  /**
   * Centralized error handling
   */
  private handleError(operation: string, error: unknown): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    this.logger.error(`Failed to ${operation}: ${message}`);

    // Re-throw known exceptions
    if (
      error instanceof NotFoundException ||
      error instanceof InternalServerErrorException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }

    // Wrap unknown errors
    throw new InternalServerErrorException(`Failed to ${operation}`);
  }
}
