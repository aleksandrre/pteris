import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    icon: { type: String, default: '' },
    features: [{ type: String }],
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
