// File: src/__tests__/unit/notification.controller.test.ts
import { NotificationController } from "../../src/controllers/notification_controller";
import { HttpError } from "../../src/errors/http-error";
import NotificationModel from "../../src/models/notification";

describe('NotificationController', () => {
  let controller: NotificationController;
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    jest.restoreAllMocks();
    controller = new NotificationController();
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    req = { params:{}, headers: {}, userId:'u1', guideId:'g1' };
  });

  test('getUserNotifications - success', async () => {
    const limit = jest.fn().mockResolvedValue([{ id: 'n1' }]);
    const sort = jest.fn().mockReturnValue({ limit });
    jest.spyOn(NotificationModel, 'find').mockReturnValue({ sort } as any);

    await controller.getUserNotifications(req,res,next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });

  test('getGuideNotifications - unauthorized', async () => {
    req.guideId = undefined;
    await controller.getGuideNotifications(req,res,next);
    expect(next).toHaveBeenCalledWith(expect.any(HttpError));
  });

  test('markAsRead - success', async () => {
    req.params = { id: 'n1' };
    const notification: any = {
      guideId: { toString: () => 'g1' },
      userId: undefined,
      read: false,
      save: jest.fn().mockResolvedValue(undefined),
    };
    jest.spyOn(NotificationModel, 'findById').mockResolvedValue(notification);

    await controller.markAsRead(req,res,next);
    expect(notification.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('deleteNotification - success', async () => {
    req.params = { id: 'n1' };
    const notification: any = {
      guideId: { toString: () => 'g1' },
      userId: undefined,
    };
    jest.spyOn(NotificationModel, 'findById').mockResolvedValue(notification);
    const deleteSpy = jest.spyOn(NotificationModel, 'findByIdAndDelete').mockResolvedValue({} as any);

    await controller.deleteNotification(req,res,next);
    expect(deleteSpy).toHaveBeenCalledWith('n1');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('deleteNotification - unauthorized', async () => {
    req.params = { id: 'n1' };
    req.guideId = undefined; req.userId = undefined;
    jest.spyOn(NotificationModel, 'findById').mockResolvedValue({
      guideId: { toString: () => 'g1' },
      userId: undefined,
    } as any);

    await controller.deleteNotification(req,res,next);
    expect(next).toHaveBeenCalledWith(expect.any(HttpError));
  });

  test('createNotification - success', async () => {
    const saveSpy = jest.spyOn(NotificationModel.prototype as any, 'save').mockResolvedValue(undefined);
    const result = await controller.createNotification({ type:'system', message:'hi' });
    expect(saveSpy).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});