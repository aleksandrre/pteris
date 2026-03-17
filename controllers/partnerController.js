import Partner from '../models/partnerModel.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3Helpers.js';

export const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({}).sort({ createdAt: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    res.json(partner);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPartner = async (req, res) => {
  const { name, category, description, projectCount, partnershipYear } = req.body;

  try {
    let image = '';
    if (req.file) {
      image = await uploadToS3(req.file, 'partners');
    }

    const partner = await Partner.create({
      name,
      category,
      description,
      projectCount,
      partnershipYear,
      image,
    });

    res.status(201).json(partner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePartner = async (req, res) => {
  const { name, category, description, projectCount, partnershipYear } = req.body;

  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Partner not found' });

    if (req.file) {
      await deleteFromS3(partner.image);
      partner.image = await uploadToS3(req.file, 'partners');
    }

    partner.name = name ?? partner.name;
    partner.category = category ?? partner.category;
    partner.description = description ?? partner.description;
    partner.projectCount = projectCount ?? partner.projectCount;
    partner.partnershipYear = partnershipYear ?? partner.partnershipYear;

    const updated = await partner.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Partner not found' });

    await deleteFromS3(partner.image);
    await partner.deleteOne();

    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
