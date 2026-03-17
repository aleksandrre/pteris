import Service from '../models/serviceModel.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3Helpers.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({}).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createService = async (req, res) => {
  const { name, shortDescription, longDescription, features } = req.body;

  try {
    let icon = '';
    if (req.file) {
      icon = await uploadToS3(req.file, 'services');
    }

    const service = await Service.create({
      name,
      shortDescription,
      longDescription,
      icon,
      features: features ? JSON.parse(features) : [],
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  const { name, shortDescription, longDescription, features } = req.body;

  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    if (req.file) {
      await deleteFromS3(service.icon);
      service.icon = await uploadToS3(req.file, 'services');
    }

    service.name = name ?? service.name;
    service.shortDescription = shortDescription ?? service.shortDescription;
    service.longDescription = longDescription ?? service.longDescription;
    service.features = features ? JSON.parse(features) : service.features;

    const updated = await service.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    await deleteFromS3(service.icon);
    await service.deleteOne();

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
