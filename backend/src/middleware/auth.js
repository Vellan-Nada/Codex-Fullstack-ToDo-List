import { ensureSupabase } from '../services/supabaseClient.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Missing bearer token' });
    }
    const supabase = ensureSupabase();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = data.user;
    req.accessToken = token;
    next();
  } catch (error) {
    next(error);
  }
}
