import { Test, TestingModule } from '@nestjs/testing';
import { FireflyIIIService } from './firefly-iii.service';

describe('FireflyIiiService', () => {
  let service: FireflyIIIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FireflyIIIService],
    }).compile();

    service = module.get<FireflyIIIService>(FireflyIIIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
