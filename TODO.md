# TODO

## 0. Minor Quality of Life Updates

[] 1. Update Login Button to Say SignIn/SignUp or make it clear how to sign Up.
[] 2. Only see the create post button if user is ADMIN
[] 3. Get app to deploy on Vercel Successfully

## 1. Update Package Json to Prevent Upgrades []

```json
{
  "dependencies": {
    "@clerk/nextjs": "4.29.0",
    "prisma": "5.0.0"
  }
}
```

## 2. Document Environment SetUp []

[] 1. Create doc/ENVIRONMENT\*SETUP.md

- List Required Env Variables
  _ Explain files they go in
  _ Provide Examples
  \_ Document Prisma CLI Requirements

## 3. Add Pre-commit Hooks []

Use `husky` to verify:
_ Prisma client is generated
_ Env variables are set \* No .env files are committed

## 4. Version Compatibility Matric []

Create this in the docs directory
