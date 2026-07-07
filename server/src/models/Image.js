import mongoose from 'mongoose';

// stores uploaded image bytes directly in MongoDB so images persist across
// deploys (Render's disk is ephemeral) and work the same locally and live
const imageSchema = new mongoose.Schema(
  {
    data: Buffer,
    contentType: { type: String, required: true },
    filename: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Image', imageSchema);
