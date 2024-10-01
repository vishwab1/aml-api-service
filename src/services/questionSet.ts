import { QuestionSet } from '../models/questionSet';

// Get a single question by ID
export const getQuestionSetById = async (id: string): Promise<any> => {
  const whereClause = {
    identifier: id,
  };

  const questionSetDetails = await QuestionSet.findOne({
    where: whereClause,
    attributes: { exclude: ['id'] },
    raw: true,
  });

  return questionSetDetails;
};
