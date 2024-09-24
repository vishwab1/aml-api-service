import { Op } from 'sequelize';
import { Status } from '../enums/status';
import { boardMaster } from '../models/boardMaster';

//get board by ids
export const getBoards = async (board_ids: number[]): Promise<any> => {
  const whereClause: Record<string, any> = { id: board_ids, is_active: true, status: Status.LIVE };
  const boards = await boardMaster.findAll({ where: whereClause, raw: true });
  return { boards };
};

export const checkBoardNameExists = async (boardName: string): Promise<boolean> => {
  const board = await boardMaster.findOne({
    where: {
      name: {
        [Op.contains]: { en: boardName },
      },
      status: Status.LIVE,
      is_active: true,
    },
  });
  return !!board;
};
