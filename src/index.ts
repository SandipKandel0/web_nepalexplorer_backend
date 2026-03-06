import dotenv from "dotenv";
import { connectDB } from "./database/mongodb";
import UserModel from "./models/user";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5050;

// Connect to Database
connectDB();

const ensureDefaultAdmin = async () => {
  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@webnepal.com";
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin12345";
  const defaultAdminUsername = process.env.DEFAULT_ADMIN_USERNAME || "admin";

  const existingByEmail = await UserModel.findOne({ email: defaultAdminEmail });
  if (existingByEmail) {
    existingByEmail.role = "admin";
    existingByEmail.username = existingByEmail.username || defaultAdminUsername;
    existingByEmail.password = defaultAdminPassword;
    await existingByEmail.save();
    console.log(`Default admin ensured: ${defaultAdminEmail}`);
    return;
  }

  const existingAdmin = await UserModel.findOne({ role: "admin" });
  if (existingAdmin) {
    return;
  }

  await UserModel.create({
    fullName: "Default Admin",
    username: defaultAdminUsername,
    email: defaultAdminEmail,
    phone: "9800000000",
    password: defaultAdminPassword,
    role: "admin",
  });

  console.log(`Default admin created: ${defaultAdminEmail}`);
};

ensureDefaultAdmin().catch((error) => {
  console.error("Failed to ensure default admin:", error);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
