import Result from '../models/resultModel.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3Helpers.js';

export const getResults = async (req, res) => {
  try {
    const results = await Result.find({}).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createResult = async (req, res) => {
  const { category, client, location, year, plantsCount, area, duration } = req.body;
  const files = req.files || {};

  try {
    const beforeImage = files.beforeImage?.[0]
      ? await uploadToS3(files.beforeImage[0], 'results')
      : '';

    const afterImage = files.afterImage?.[0]
      ? await uploadToS3(files.afterImage[0], 'results')
      : '';

    const images = files.images?.length
      ? await Promise.all(files.images.map((f) => uploadToS3(f, 'results')))
      : [];

    const result = await Result.create({
      category,
      client,
      location,
      year,
      plantsCount,
      area,
      duration,
      beforeImage,
      afterImage,
      images,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateResult = async (req, res) => {
  const { category, client, location, year, plantsCount, area, duration } = req.body;
  const files = req.files || {};

  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });

    if (files.beforeImage?.[0]) {
      await deleteFromS3(result.beforeImage);
      result.beforeImage = await uploadToS3(files.beforeImage[0], 'results');
    }

    if (files.afterImage?.[0]) {
      await deleteFromS3(result.afterImage);
      result.afterImage = await uploadToS3(files.afterImage[0], 'results');
    }

    if (files.images?.length) {
      await Promise.all(result.images.map((url) => deleteFromS3(url)));
      result.images = await Promise.all(
        files.images.map((f) => uploadToS3(f, 'results'))
      );
    }

    result.category = category ?? result.category;
    result.client = client ?? result.client;
    result.location = location ?? result.location;
    result.year = year ?? result.year;
    result.plantsCount = plantsCount ?? result.plantsCount;
    result.area = area ?? result.area;
    result.duration = duration ?? result.duration;

    const updated = await result.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });

    await deleteFromS3(result.beforeImage);
    await deleteFromS3(result.afterImage);
    await Promise.all(result.images.map((url) => deleteFromS3(url)));

    await result.deleteOne();

    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
