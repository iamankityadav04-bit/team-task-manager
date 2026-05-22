import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort('name').select('name email avatar role');
  res.json({ success: true, users });
});
