import { serverSupabaseClient } from "#supabase/server";
import { Database } from '~/types/supabase';
import protectRoute from "../../protectRoute";

export default defineEventHandler(async (event) => {
  await protectRoute(event);
  const supabase = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);

  if (body) {
    const { id, username, website, avatar_path } = body;
    const updates: Account = {
      id,
      username,
      website,
      ...avatar_path && { avatar_url: avatar_path },
      updated_at: new Date(),
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(updates);

    if (error) throw createError({ statusMessage: error.message });

    return data;
  }
});
