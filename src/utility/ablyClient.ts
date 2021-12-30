import { Ably } from "@pankod/refine-ably";

if (!process.env.NEXT_PUBLIC_ABLY_API_KEY) {
  throw new Error("NEXT_PUBLIC_ABLY_API_KEY must be define");
}

export const ablyClient = new Ably.Realtime(
  process.env.NEXT_PUBLIC_ABLY_API_KEY
);
