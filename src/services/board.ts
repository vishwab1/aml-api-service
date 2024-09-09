import { boardMaster } from '../models/boardMaster';

//get board by ids
export const getBoardsByIds = async (board_ids: number[]): Promise<any> => {
  try {
    const whereClause: Record<string, any> = { board_id: board_ids, is_active: true };
    const boards = await boardMaster.findAll({ where: whereClause, raw: true });
    return { error: false, boards };
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to get records';
    return { error: true, message: errorMessage };
  }
};
