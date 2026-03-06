// File: src/__tests__/unit/guideRequest.controller.test.ts
import { GuideRequestController } from "../../src/controllers/guide_request_controller";
import { HttpError } from "../../src/errors/http-error";

describe('GuideRequestController', () => {
  let controller: GuideRequestController;
  let service: any;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    service = {
      createGuideRequest: jest.fn(),
      getRequestsByGuestId: jest.fn(),
      getRequestsByGuideId: jest.fn(),
      getAllRequests: jest.fn(),
      getRequestById: jest.fn(),
      updateRequestStatus: jest.fn(),
      deleteRequest: jest.fn(),
    };
    controller = new GuideRequestController();
    (controller as any).guideRequestService = service;

    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    req = { body:{}, params:{}, user:{ id:'u1' } };
  });

  test('createGuideRequest - success', async () => {
    service.createGuideRequest.mockResolvedValue({ id:'r1' });
    await controller.createGuideRequest(req,res,next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('createGuideRequest - unauthorized', async () => {
    req.user = undefined;
    await controller.createGuideRequest(req,res,next);
    expect(next).toHaveBeenCalledWith(expect.any(HttpError));
  });

  test('getMyGuideRequests - success', async () => {
    service.getRequestsByGuestId.mockResolvedValue([{}]);
    await controller.getMyGuideRequests(req,res,next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });

  test('getMyRequestedGuides - success', async () => {
    service.getRequestsByGuideId.mockResolvedValue([{}]);
    await controller.getMyRequestedGuides(req,res,next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });

  test('updateRequestStatus - success', async () => {
    service.updateRequestStatus.mockResolvedValue({ status:'approved' });
    req.body = { status:'approved' }; req.params = { id:'r1' };
    await controller.updateRequestStatus(req,res,next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });

  test('deleteRequest - success', async () => {
    service.deleteRequest.mockResolvedValue({});
    req.params = { id:'r1' };
    await controller.deleteRequest(req,res,next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success:true }));
  });
});