import { serverSupabaseUser } from '#supabase/server';
import { H3Event, EventHandlerRequest } from 'h3';

export default async (event: H3Event<EventHandlerRequest>) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
};
