import { auth } from "./lib/auth";

async function main() {
  console.log("Creating admin user...");

  try {
    const response = await auth.api.signUpEmail({
      body: {
        name: "Admin User",
        email: "admin@example.com",
        password: "securepassword123",
      },
    });

    console.log("✅ Admin user created successfully:", response.user.email);
    console.log("👉 Next step: Open 'lib/auth.ts' and change 'disableSignUp: false' to 'true' to secure your CMS.");
    
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error?.message || error);
    console.log("If the user already exists, you can just log in with it!");
  }

  process.exit(0);
}

main();
