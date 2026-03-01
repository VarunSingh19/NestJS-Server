import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) { }

  // Create a new course
  async create(createCourseDto: CreateCourseDto, userId: string): Promise<Course> {
    const createdCourse = await this.courseModel.create({ ...createCourseDto, createdBy: userId });
    return createdCourse;
  }

  // Retrieve all courses
  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  // Retrieve a single course by ID
  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  // Update a course by ID
  async update(id: string, updateCourseDto: UpdateCourseDto, userId: string): Promise<Course> {
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    if (course.createdBy !== userId) {
      throw new UnauthorizedException('Not authorized to update this course');
    }
    const updated = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, { new: true });
    if (!updated) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return updated;
  }

  // Delete a course by ID
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    if (course.createdBy !== userId) {
      throw new UnauthorizedException('Not authorized to delete this course');
    }
    await this.courseModel.findByIdAndDelete(id);
    return { message: `Course with ID ${id} successfully deleted` };
  }
}