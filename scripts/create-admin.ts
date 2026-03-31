import "dotenv/config";

import { auth } from "../lib/auth";

async function main() {
  console.log("Creating admin user...");

  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "Admin User";

    if (!email || !password) {
      throw new Error(
        "Set ADMIN_EMAIL and ADMIN_PASSWORD before running this script."
      );
    }

    const response = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    console.log("✅ Admin user created successfully:", response.user.email);
    console.log(
      "👉 Recommended: keep BETTER_AUTH_ALLOW_SIGN_UP unset once the admin account exists."
    );
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error?.message || error);
    console.log(
      "If the user already exists, you can log in with it and leave public sign-up disabled."
    );
  }

  process.exit(0);
}

main();
