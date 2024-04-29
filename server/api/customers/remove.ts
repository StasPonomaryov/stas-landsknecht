import { serverSupabaseClient } from "#supabase/server";
import { Database } from '~/types/supabase';
import protectRoute from "../../protectRoute";

export default defineEventHandler(async (event) => {
  await protectRoute(event);
  const supabase = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);

  if (body) {
    const { id } = body;    

    const { error } = await supabase
      .from('test-customers')
      .delete()
      .eq('id', id);

    if (error) {
      throw createError({ statusMessage: error.message })
    };
  }
});
