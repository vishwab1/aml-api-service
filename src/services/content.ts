import { Op } from 'sequelize';
import { Content } from '../models/content';

// Get a media Content by ID
export const getContentMediaById = async (getObject: { contentId: number; mediaIds: string[] }): Promise<any> => {
  const whereClause: any = { id: getObject.contentId };
  if (getObject.mediaIds) {
    const mediaConditions = getObject.mediaIds.map((id) => ({ id }));

    whereClause.media = {
      [Op.contains]: mediaConditions,
    };
  }

  const mediaMetaData = await Content.findOne({
    where: whereClause,
    attributes: ['id', 'media'],
    raw: true,
  });

  return mediaMetaData;
};
