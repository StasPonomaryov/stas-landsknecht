import { serverSupabaseClient } from "#supabase/server";
import { Database } from '~/types/supabase';
import protectRoute from "../../protectRoute";

export default defineEventHandler(async (event) => {
  await protectRoute(event);
  const supabase = await serverSupabaseClient<Database>(event);
  const { q } = getQuery(event);
  if (q && q === 'count') {
    const { count, error } = await supabase
      .from('test-customers')
      .select('*', { count: 'exact', head: true });

    if (error) throw createError({ statusMessage: error.message });

    return count;
  }
  const { data, error } = await supabase
    .from('test-customers')
    .select(`id, name, description, contacts`);

  if (error) throw createError({ statusMessage: error.message });

  return data;
});
