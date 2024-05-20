import { serverSupabaseClient } from "#supabase/server";
import { Database } from '~/types/supabase';
import protectRoute from "../../protectRoute";

export default defineEventHandler(async (event) => {
  await protectRoute(event);
  const supabase = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);
  
  if (body) {
    const { name, description, contacts, user_id } = body;
    const updates: Customer = {
      name: name,
      ...description && { description },
      contacts,
      created_at: new Date(),
      user_id
    }

    const { data, error } = await supabase
      .from('test-customers')
      .insert(updates)
      .select('id, name, description, contacts')
      .single();

    if (error) {
      throw createError({ statusMessage: error.message })
    };

    return data;
  }
});
