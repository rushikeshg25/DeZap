import { Request, Response } from 'express';
import { replyToUser } from '../services/discord';

export const notifyUser = async (req: Request, res: Response) => {
    const { userId, message, channelId } = req.body;

    if (!userId || !message) {
        return res.status(400).json({ success: false, message: 'userId and message are required' });
    }
    if (userId) {
        const result = await replyToUser(userId, message, channelId, false);// false coz it's a notification
        res.status(result.success ? 200 : 500).json(result);
    } else {
        res.status(404).json({ success: false, message: `User with ID ${userId} not found` });
    }
}