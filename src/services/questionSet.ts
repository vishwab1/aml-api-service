import { Op, Optional } from 'sequelize';
import * as _ from 'lodash';
import { QuestionSet } from '../models/quetionSet';
import { Status } from '../enums/status';

// Create a new question set
export const createQuestionSetData = async (req: Optional<any, string> | undefined): Promise<any> => {
  const insertQuestionSet = await QuestionSet.create(req);
  return insertQuestionSet.dataValues;
};

// Get a single question by ID
export const getQuestionSetById = async (id: string, additionalConditions: object = {}): Promise<any> => {
  // Combine base conditions with additional conditions
  const conditions = {
    identifier: id,
    ...additionalConditions, // Spread additional conditions here
  };

  const questionSetDetails = await QuestionSet.findOne({
    where: conditions,
    attributes: { exclude: ['id'] },
  });

  return questionSetDetails?.dataValues;
};

// Get a single question set by name
export const getQuestionSetByName = async (title: string): Promise<any> => {
  const getQuestionSet = await QuestionSet.findOne({ where: { title }, raw: true });
  return { error: false, getQuestionSet };
};

// Update a single question set
export const updateQuestionSet = async (questionIdentifier: string, updatedata: any): Promise<any> => {
  // Update the question in the database
  return await QuestionSet.update(updatedata, {
    where: { identifier: questionIdentifier },
  });
};

// Publish question set
export const publishQuestionSetById = async (id: string): Promise<any> => {
  const questionSetDetails = await QuestionSet.update({ status: Status.LIVE }, { where: { identifier: id }, returning: true });
  return questionSetDetails;
};

// Delete a question set (soft delete)
export const deleteQuestionSet = async (id: string): Promise<any> => {
  const questionSetDetails = await QuestionSet.update({ is_active: false }, { where: { identifier: id }, returning: true });
  return questionSetDetails;
};

// Discard question set (hard delete)
export const discardQuestionSet = async (id: string): Promise<any> => {
  const questionSet = await QuestionSet.destroy({
    where: { identifier: id },
  });
  return questionSet;
};

// Get list of question sets with optional filters
export const getQuestionSetList = async (req: Record<string, any>) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const { filters = {} } = req || {};

  const whereClause: any = {};

  whereClause.status = Status.LIVE;
  whereClause.is_active = true;

  if (filters.title) {
    whereClause.title = {
      [Op.or]: filters.title.map((termObj: any) => {
        const [key, value] = Object.entries(termObj)[0];
        return {
          [key]: { [Op.iLike]: `%${String(value)}%` },
        };
      }),
    };
  }
  // Handle question_set_id as an array filter
  if (filters.question_set_id) {
    whereClause['question_set_id'] = {
      [Op.in]: filters.question_set_id, // Match any of the provided IDs
    };
  }

  // Fetch question sets with the applied filters and join
  const questionSets = await QuestionSet.findAll({
    limit: limit || 100,
    offset: offset || 0,
    where: whereClause,
    attributes: { exclude: ['id'] }, // Exclude 'id' if necessary
  });

  return questionSets;
};
