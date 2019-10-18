import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingcartController } from './shoppingcart.controller';

describe('Shoppingcart Controller', () => {
  let controller: ShoppingcartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingcartController],
    }).compile();

    controller = module.get<ShoppingcartController>(ShoppingcartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
