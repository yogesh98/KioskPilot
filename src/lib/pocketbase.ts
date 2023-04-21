import PocketBase from "pocketbase";

const pb: PocketBase = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
await pb.admins.authWithPassword(
  import.meta.env.VITE_USER_ID,
  import.meta.env.VITE_PASSWORD
);

export default pb;
