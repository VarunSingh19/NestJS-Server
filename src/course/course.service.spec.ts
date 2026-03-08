import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { getModelToken } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getModelToken(Course.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
