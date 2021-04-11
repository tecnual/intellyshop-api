import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SavedListController } from './saved-list.controller';
import { SavedList } from './saved-list.schema';
import { SavedListService } from './saved-list.service';

describe('SavedListController', () => {
  let controller: SavedListController;
  let savedListService: SavedListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedListController],
      providers: [
        SavedListService,
        {
          provide: getModelToken(SavedList.name),
          useValue: SavedList,
        },
      ]
    }).compile();

    controller = module.get<SavedListController>(SavedListController);
    savedListService = module.get<SavedListService>(SavedListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
