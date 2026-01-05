import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user_repository";
import { JWT_SECRET } from "../configs"; // Named import

// UserService handles all business logic related to users
export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }
async register(data: any) {
  // Check unique email and username
  if (await this.userRepo.getUserByEmail(data.email)) {
    throw new Error("Email already exists");
  }
  if (await this.userRepo.getUserByUsername(data.username)) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await this.userRepo.createUser({
    ...data,
    password: hashedPassword,
  });

  return user;
}

async login(email: string, password: string) {
  const user = await this.userRepo.getUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return { user, token };
}
}