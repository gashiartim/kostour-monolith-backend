import { Test, TestingModule } from "@nestjs/testing";
import { LocationController } from "./location.controller";
import { LocationsService } from "./location.service";

describe("LocationsController", () => {
  let controller: LocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [LocationsService],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
