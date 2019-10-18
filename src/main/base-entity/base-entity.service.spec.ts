import { Test, TestingModule } from '@nestjs/testing';
import { BaseEntityService } from './base-entity.service';

describe('BaseEntityService', () => {
  let service: BaseEntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseEntityService],
    }).compile();

    service = module.get<BaseEntityService>(BaseEntityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
