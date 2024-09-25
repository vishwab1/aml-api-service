import _ from 'lodash';
import { Status } from '../enums/status';
import { classMaster } from '../models/classMaster';

// Update a single class
export const updateClassData = async (identifier: string, req: any): Promise<any> => {
  const whereClause: Record<string, any> = { identifier, is_active: true, status: Status.LIVE };
  const updateClass = await classMaster.update(req, { where: whereClause });
  return { updateClass };
};

// Get class by identifier
export const getClassById = async (class_id: string): Promise<any> => {
  const classData = await classMaster.findOne({
    where: { identifier: class_id, is_active: true, status: Status.LIVE },
    attributes: { exclude: ['id'] },
  });
  return { classData };
};

// check class by id
export const getClassIds = async (classIds: number[]): Promise<any> => {
  const classDataIds = await classMaster.findAll({
    where: { id: classIds, status: Status.LIVE, is_active: true },
    raw: true,
  });
  return classDataIds;
};

export const checkClassIdsExists = async (classIds: number[]): Promise<boolean> => {
  const existingClassRecords = await getClassIds(classIds);

  const existingClassIds = _.map(existingClassRecords, 'id'); // Extract only the IDs from the existing records

  // Use Lodash to check if the arrays have the same elements (i.e., no missing IDs)
  const missingClassIds = _.difference(classIds, existingClassIds);

  // If there are no missing IDs, return true, else return false
  return _.isEmpty(missingClassIds);
};
