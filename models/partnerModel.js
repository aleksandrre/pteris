import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    projectCount: { type: Number, required: true },
    partnershipYear: { type: Number, required: true },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

const Partner = mongoose.model('Partner', partnerSchema);
export default Partner;
