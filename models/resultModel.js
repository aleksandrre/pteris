import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    client: { type: String, required: true },
    location: { type: String, required: true },
    year: { type: Number, required: true },
    plantsCount: { type: String, required: true },
    area: { type: String, required: true },
    duration: { type: String, required: true },
    beforeImage: { type: String, default: '' },
    afterImage: { type: String, default: '' },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Result = mongoose.model('Result', resultSchema);
export default Result;
