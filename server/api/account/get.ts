import { serverSupabaseClient } from "#supabase/server";
import { Database } from '~/types/supabase';
import protectRoute from "../../protectRoute";

export default defineEventHandler(async (event) => {
  await protectRoute(event);
  const supabase = await serverSupabaseClient<Database>(event);
  const { id } = getQuery(event);

  if (id) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', id)
      .single();

    if (error) throw createError({ statusMessage: error.message });

    return data;
  }
});
