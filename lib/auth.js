
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

// Reuse the MongoDB client across warm server instances.
const globalForMongo = globalThis;

const client =
  globalForMongo.mongoClient ??
  new MongoClient(mongoUri);

if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = client;
}

const db = client.db();

const socialProviders = {};

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

const appUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

const trustedOrigins = [
  "http://localhost:3000",
  appUrl,
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
].filter(Boolean);

export const auth = betterAuth({
  appName: "Bazar Dor",
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders,

  trustedOrigins: [...new Set(trustedOrigins)],
});
