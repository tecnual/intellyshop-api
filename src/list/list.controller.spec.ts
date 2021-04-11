import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { ListController } from './list.controller';
import { ListModule } from './list.module';
import { ListService } from './list.service';

describe('ListController', () => {
  let controller: ListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ListModule
      ],
      controllers: [ListController],
      providers: [ListService],
    }).overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = {name: 'test'};
        return true;
      },
    })
    .compile();

    controller = module.get<ListController>(ListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
