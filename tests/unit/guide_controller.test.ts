// File: src/__tests__/unit/guide.controller.test.ts
import { GuideController } from "../../src/controllers/guide_controller";
import { GuideService } from "../../src/services/guide_service";
import { HttpError } from "../../src/errors/http-error";

describe('GuideController', () => {
  let controller: GuideController;
  let service: any;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    service = new GuideService() as any;
    service.registerGuide = jest.fn();
    service.loginGuide = jest.fn();
    service.getGuideById = jest.fn();
    service.updateGuide = jest.fn();
    service.getAllGuides = jest.fn();

    controller = new GuideController();
    (controller as any).guideService = service;

    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    req = { body: {}, params: {}, file: undefined, query:{} };
  });

  test('registerGuide - success', async () => {
    req.body = { fullName:'G', email:'g@b.com', password:'123456', phone:'123', language:'en', experience:'1', city:'X' };
    service.registerGuide.mockResolvedValue({ id:'g1' });
    await controller.registerGuide(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('registerGuide - missing fields', async () => {
    req.body = { email:'g@b.com' };
    await controller.registerGuide(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(HttpError));
  });

  test('loginGuide - success', async () => {
    req.body = { email:'g@b.com', password:'123456' };
    service.loginGuide.mockResolvedValue({ token:'t' });
    await controller.loginGuide(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });

  test('loginGuide - missing email', async () => {
    req.body = { password:'123' };
    await controller.loginGuide(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(HttpError));
  });

  test('getGuideById - success', async () => {
    req.params = { id:'g1' };
    service.getGuideById.mockResolvedValue({ id:'g1' });
    await controller.getGuideById(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });

  test('getAllGuides - success', async () => {
    req.query = {};
    service.getAllGuides.mockResolvedValue([{ id:'g1' }]);
    await controller.getAllGuides(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });
});