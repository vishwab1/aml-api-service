import { Op } from 'sequelize';
import { Content } from '../models/content'; // Import Content model

// Get a media Content by ID
export const getContentMediaById = async (getObject: { contentId: number; mediaIds: string[] }): Promise<any> => {
  const conditions: any = { id: getObject.contentId };
  if (getObject.mediaIds) {
    const mediaConditions = getObject.mediaIds.flatMap((mediaId) => ({
      [Op.contains]: `${mediaId}`,
    }));
    conditions.media = mediaConditions;
  }

  const mediaMetaData = await Content.findOne({
    where: conditions,
    attributes: ['id', 'media'],
    raw: true,
  });

  return mediaMetaData;
};
