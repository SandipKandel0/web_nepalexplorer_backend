import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "../../src/controllers/admin_controller";
import { UserService } from "../../src/services/user_service";
import { UpdateUserDto } from "../../src/dtos/user_dtos";

describe("AdminController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.restoreAllMocks();
    req = { body: {}, params: {}, file: undefined };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test("createUser - success", async () => {
    req.body = {
      fullName: "Test User",
      username: "testuser",
      email: "test@example.com",
      phoneNumber: "9800000000",
      password: "123456",
      role: "user",
    };

    jest.spyOn(UserService.prototype, "register").mockResolvedValue({ id: "1" } as any);

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test("getAllUsers - success", async () => {
    jest.spyOn(UserService.prototype, "getAllUsers").mockResolvedValue([{ id: "1" }] as any);

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test("getUserById - not found", async () => {
    req.params = { id: "1" };
    jest.spyOn(UserService.prototype, "getUserById").mockResolvedValue(null as any);

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateUser - success", async () => {
    req.params = { id: "1" };
    req.body = { fullName: "Updated" };

    jest.spyOn(UpdateUserDto, "parse").mockReturnValue(req.body);
    jest.spyOn(UserService.prototype, "updateUser").mockResolvedValue({ id: "1", fullName: "Updated" } as any);

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test("deleteUser - success", async () => {
    req.params = { id: "1" };
    jest.spyOn(UserService.prototype, "deleteUser").mockResolvedValue({ id: "1" } as any);

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
