import { serverSupabaseClient } from "#supabase/server";
import { Database } from '~/types/supabase';
import protectRoute from "../../protectRoute";

export default defineEventHandler(async (event) => {
  await protectRoute(event);
  const supabase = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);

  if (body) {
    const { name, description, contacts } = body;
    const updates: Customer = {
      name: name,
      ...description && { description },
      contacts,
      created_at: new Date(),
    }

    const { data, error } = await supabase
      .from('test-customers')
      .upsert(updates)
      .select('*')
      .single();

    if (error) {
      throw createError({ statusMessage: error.message })
    };

    return data;
  }
});
