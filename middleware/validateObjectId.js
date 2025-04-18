import mongoose from 'mongoose';

export default function validateObjectId(req, res, next) {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ObjectId' });
  }
  next();
}
