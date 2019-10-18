import { Test, TestingModule } from '@nestjs/testing';
import { GlobalErrorService } from './global-error.service';

describe('GlobalErrorService', () => {
  let service: GlobalErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalErrorService],
    }).compile();

    service = module.get<GlobalErrorService>(GlobalErrorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
