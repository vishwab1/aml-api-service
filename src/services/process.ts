import { Process } from '../models/process';
import { Optional } from 'sequelize';

//create service for Process
export const createProcess = async (req: Optional<any, string>): Promise<any> => {
  const insertProcess = await Process.create(req);
  const { dataValues } = insertProcess;
  return { dataValues };
};

//get Single Process by meta data
export const getProcessByMetaData = async (req: any): Promise<any> => {
  req.is_active = true;
  const getProcess = await Process.findAll({ where: req });
  return { error: false, getProcess };
};

//update single Process
export const updateProcess = async (process_id: string, req: any): Promise<any> => {
  const whereClause: Record<string, any> = { process_id, is_active: true };
  const updateProcess = await Process.update(req, { where: whereClause });
  return { updateProcess };
};

//get Single Process by id
export const getProcessById = async (process_id: string): Promise<any> => {
  const whereClause: Record<string, any> = { process_id, is_active: true };
  const getProcess = await Process.findOne({ where: whereClause, raw: true });
  return { getProcess };
};
