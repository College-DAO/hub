import { NextApiRequest, NextApiResponse } from 'next';
import useUserId from '~/core/hooks/use-user-id';
// Import any necessary functions or libraries for getting the user ID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Implement the logic to get the user ID here
    const userId = await useUserId();
    console.log(userId)
    res.status(200).json({ userId });
  } catch (error) {
    console.error('Error getting user ID:', error);
    res.status(500).json({ error: 'Failed to get user ID' });
  }
}