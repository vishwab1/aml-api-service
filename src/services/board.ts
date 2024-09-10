import { Status } from '../enums/status';
import { boardMaster } from '../models/boardMaster';

//get board by ids
export const getBoards = async (board_ids: number[]): Promise<any> => {
  const whereClause: Record<string, any> = { id: board_ids, is_active: true, status: Status.LIVE };
  const boards = await boardMaster.findAll({ where: whereClause, raw: true });
  return { boards };
};
