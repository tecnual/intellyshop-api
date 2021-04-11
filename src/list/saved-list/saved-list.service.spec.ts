import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SavedListService } from './saved-list.service';

describe('SavedListService', () => {
  let service: SavedListService;

  beforeEach(async () => {
    function mockSavedListModel(dto: any) {
      this.data = dto;
      this.save  = () => {
        return this.data;
      };
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SavedListService,
        {
          provide: getModelToken('SavedList'),
          useValue: mockSavedListModel,
        }
      ],
    }).compile();

    service = module.get<SavedListService>(SavedListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
