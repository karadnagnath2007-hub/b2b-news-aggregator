# Prisma Migration Instructions

This project uses Prisma with a Supabase PostgreSQL database.

## Local `.env` setup

Create a `.env` file in the repository root with these values:

```env
DATABASE_URL="postgresql://postgres.cglnfdkclkndnxpbxizr:<YOUR-PASSWORD>@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.cglnfdkclkndnxpbxizr:<YOUR-PASSWORD>@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

Replace `<YOUR-PASSWORD>` with your Supabase database password.

## Available Prisma commands

Run these commands from the repository root:

```bash
npm install
npm run prisma:db:pull
npm run prisma:migrate
npm run prisma:generate
```

## Notes

- `prisma db pull` will introspect existing tables in the target database.
- If the database is empty, use `npm run prisma:migrate` to create the schema from `prisma/schema.prisma`.
- `npm run prisma:generate` regenerates the Prisma client after schema changes.
