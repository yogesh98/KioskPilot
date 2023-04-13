import PocketBase from 'pocketbase';

const pb: PocketBase = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

export default pb;