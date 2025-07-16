import { DataSource } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User, UserRole, AuthProvider } from "../../users/entities/user.entity";

export async function seedAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { id: "ADMIN" },
  });

  if (existingAdmin) {
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash("Pabitra1@", 10);

  const adminUser = userRepository.create({
    id: "ADMIN",
    email: "pabitraghara@gmail.com",
    name: "Pabitra Ghara",
    password: hashedPassword,
    role: UserRole.ADMIN,
    provider: AuthProvider.LOCAL,
    isActive: true,
  });

  await userRepository.save(adminUser);
  console.log("Email: pabitraghara@gmail.com");
  console.log("Password: Pabitra1@");
}
