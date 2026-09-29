import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export const createClient = () => {
  if (typeof window === "undefined") {
    return createBrowserClient(supabaseUrl!, supabaseKey!);
  }
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl!, supabaseKey!);
  }
  return browserClient;
};
