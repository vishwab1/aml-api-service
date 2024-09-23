import { Process } from '../models/process';

//create service for Process
export const createProcess = async (insertData: Record<string, unknown>): Promise<any> => {
  const insertProcess = await Process.create(insertData);
  const { dataValues } = insertProcess;
  return { dataValues };
};

//get Single Process by id
export const getProcessById = async (process_id: string): Promise<any> => {
  const whereClause: Record<string, unknown> = { process_id, is_active: true };
  const getProcess = await Process.findOne({ where: whereClause, raw: true });
  return { getProcess };
};
