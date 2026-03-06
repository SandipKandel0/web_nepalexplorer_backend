// File: src/__tests__/unit/user.controller.test.ts
import { UserController } from "../../src/controllers/user_controller";
import { UserService } from "../../src/services/user_service";
import { HttpError } from "../../src/errors/http-error";

describe('UserController', () => {
  let controller: UserController;
  let service: any;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    service = new UserService() as any;
    service.registerUser = jest.fn();
    service.loginUser = jest.fn();
    service.getUserById = jest.fn();
    service.updateUser = jest.fn();
    service.addFavourite = jest.fn();
    service.removeFavourite = jest.fn();
    service.getFavourites = jest.fn();

    controller = new UserController();
    (controller as any).userService = service;

    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    req = { body: {}, params: {}, file: undefined };
  });

  test('registerUser - success', async () => {
    req.body = { fullName:'Test', email:'a@b.com', password:'123456', confirmPassword:'123456', phone:'123' };
    service.registerUser.mockResolvedValue({ id: '1', email: 'a@b.com' });
    await controller.registerUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('registerUser - missing fields', async () => {
    req.body = { email:'a@b.com' };
    await controller.registerUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(HttpError));
  });

  test('loginUser - success', async () => {
    req.body = { email:'a@b.com', password:'123456' };
    service.loginUser.mockResolvedValue({ token:'abc' });
    await controller.loginUser(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });

  test('loginUser - missing password', async () => {
    req.body = { email:'a@b.com' };
    await controller.loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(HttpError));
  });

  test('getUserById - success', async () => {
    req.params = { id:'1' };
    service.getUserById.mockResolvedValue({ id:'1' });
    await controller.getUserById(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });

  test('getUserById - not found', async () => {
    req.params = { id:'1' };
    service.getUserById.mockResolvedValue(null);
    await controller.getUserById(req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: null })
    );
  });

  test('addFavourite - success', async () => {
    req.body = { userId:'1', guideId:'g1' };
    service.addFavourite.mockResolvedValue({ fav: true });
    await controller.addFavourite(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });
});