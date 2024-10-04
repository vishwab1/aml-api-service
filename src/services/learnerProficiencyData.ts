import { Optional } from 'sequelize';
import { LearnerProficiencyQuestionLevelData } from '../models/learnerProficiencyQuestionLevelData';
import { LearnerProficiencyAggregateData } from '../models/learnerProficiencyAggregateData';
import { LearnerProficiencyQuestionSetLevelData } from '../models/learnerProficiencyQuestionSetLevelData';

export const getQuestionLevelDataByLearnerIdAndQuestionId = async (learnerId: string, questionId: string): Promise<any> => {
  return LearnerProficiencyQuestionLevelData.findOne({
    where: { learner_id: learnerId, question_id: questionId },
    attributes: { exclude: ['id'] },
    raw: true,
  });
};

export const createLearnerProficiencyQuestionLevelData = async (req: Optional<any, string> | undefined): Promise<any> => {
  const res = await LearnerProficiencyQuestionLevelData.create(req);
  const { dataValues } = res;
  return { dataValues };
};

export const updateLearnerProficiencyQuestionLevelData = async (identifier: string, req: any): Promise<any> => {
  const whereClause: Record<string, any> = { identifier };
  const updatedLearnerData = await LearnerProficiencyQuestionLevelData.update(req, {
    where: whereClause,
  });
  return { updatedLearnerData };
};

export const readLearnerAggregateData = async (learnerId: string): Promise<{ learnerAggregateData: any }> => {
  const learnerAggregateData = await LearnerProficiencyAggregateData.findAll({
    where: { learner_id: learnerId },
    order: [['updated_at', 'desc']],
    attributes: { exclude: ['id'] },
    raw: true,
  });

  return { learnerAggregateData };
};

export const getRecordsForLearnerByQuestionSetId = async (learnerId: string, questionSetId: string): Promise<any> => {
  return LearnerProficiencyQuestionLevelData.findAll({
    where: { learner_id: learnerId, question_set_id: questionSetId },
    raw: true,
  });
};

export const getQuestionSetLevelDataByLearnerIdAndQuestionSetId = async (learnerId: string, questionSetId: string): Promise<any> => {
  return LearnerProficiencyQuestionSetLevelData.findOne({
    where: { learner_id: learnerId, question_set_id: questionSetId },
    attributes: { exclude: ['id'] },
    raw: true,
  });
};

export const createLearnerProficiencyQuestionSetLevelData = async (req: Optional<any, string> | undefined): Promise<any> => {
  const res = await LearnerProficiencyQuestionSetLevelData.create(req);
  const { dataValues } = res;
  return { dataValues };
};

export const updateLearnerProficiencyQuestionSetLevelData = async (identifier: string, req: any): Promise<any> => {
  const whereClause: Record<string, any> = { identifier };
  const updatedLearnerData = await LearnerProficiencyQuestionSetLevelData.update(req, {
    where: whereClause,
  });
  return { updatedLearnerData };
};
