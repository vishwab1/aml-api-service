import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../../services/validationService';
import learnerProficiencyDataSyncJSON from './syncLearnerProficiencyDataValidationSchema.json';
import logger from '../../../utils/logger';
import { ResponseHandler } from '../../../utils/responseHandler';
import { amlError } from '../../../types/amlError';
import {
  getQuestionLevelDataByLearnerIdAndQuestionId,
  createLearnerProficiencyQuestionLevelData,
  updateLearnerProficiencyQuestionLevelData,
  getRecordsForLearnerByQuestionSetId,
  createLearnerProficiencyQuestionSetLevelData,
  getQuestionSetLevelDataByLearnerIdAndQuestionSetId,
  updateLearnerProficiencyQuestionSetLevelData,
} from '../../../services/learnerProficiencyData';
import { getQuestionSetsByIdentifiers } from '../../../services/questionSet';
import { getQuestionsByIdentifiers, getQuestionsCountForQuestionSet } from '../../../services/question';
import * as uuid from 'uuid';

const calculateSubSkillScoresForQuestion = (question: any, learnerResponse: number): { [skillType: string]: number } => {
  const { question_body } = question;
  const subSkillScoreMap: { [skillType: string]: number } = {};
  if (question_body) {
    const wrongAnswers = question_body.wrongAnswers as { option: number; subSkill: string[] }[];
    for (const wrongAnswer of wrongAnswers) {
      if (wrongAnswer.option === learnerResponse) {
        wrongAnswer.subSkill.forEach((subSkill) => _.set(subSkillScoreMap, subSkill, 0));
      }
    }
  }

  /**
   * Giving full score for remaining sub-skills
   */
  const subSkills = (question?.sub_skills || []) as { name: { en: string } }[];
  if (subSkills.length) {
    for (const subSkill of subSkills) {
      const skillName = subSkill.name.en;
      if (!_.get(subSkillScoreMap, skillName, undefined)) {
        _.set(subSkillScoreMap, skillName, 1);
      }
    }
  }

  return subSkillScoreMap;
};

const calculateAverageScoreForGivenSubSkill = (questionLevelData: any[], subSkill: string): number => {
  let totalScore = 0;
  let totalQuestions = 0;

  for (const data of questionLevelData) {
    const subSkills = (data?.sub_skills || {}) as { [skillName: string]: number };
    if (_.get(subSkills, subSkill)) {
      totalScore += _.get(subSkills, subSkill);
      totalQuestions++;
    }
  }

  return +(totalScore / totalQuestions).toFixed(2);
};

const calculateSubSkillScoresForQuestionSet = (questionLevelData: any[]): { [skillType: string]: number } => {
  const subSkillScoreMap: { [skillType: string]: number } = {};

  let allRelatedSubSkills: string[] = [];

  for (const data of questionLevelData) {
    allRelatedSubSkills = [...allRelatedSubSkills, ...data.sub_skills];
  }

  allRelatedSubSkills = _.uniq(allRelatedSubSkills);

  for (const subSkill of allRelatedSubSkills) {
    const score = calculateAverageScoreForGivenSubSkill(questionLevelData, subSkill);
    _.set(subSkillScoreMap, subSkill, score);
  }

  return subSkillScoreMap;
};

const calculateAvergaeScoreForQuestionSet = (questionLevelData: any[]): number => {
  let totalScore = 0;

  for (const data of questionLevelData) {
    totalScore += data.score;
  }

  return +(totalScore / questionLevelData.length).toFixed(2);
};

const learnerProficiencyDataSync = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  // TODO: validate learner_id

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, learnerProficiencyDataSyncJSON);

  if (!isRequestValid.isValid) {
    const code = 'LEARNER_PROFICIENCY_DATA_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const { learner_id, questions_data } = dataBody;

  const questionMap: any = {};

  /**
   * DB QUERIES
   */
  const questionIds = questions_data.map((datum: any) => datum.question_id);
  const questions = await getQuestionsByIdentifiers(questionIds);

  const questionSetIds = _.uniq(questions.map((question: any) => question.question_set_id));
  const questionSets = await getQuestionSetsByIdentifiers(questionSetIds as string[]);

  for (const question of questions) {
    _.set(questionMap, question.identifier, question);
  }

  /**
   * Updating question level data in the following block
   */
  for (const datum of questions_data) {
    const { question_id, learner_response } = datum;
    const question = _.get(questionMap, question_id, undefined);

    /**
     * Validating question_id
     */
    if (!question) {
      logger.error({ apiId, msgid, resmsgid, requestBody, message: `question with identifier ${question_id} not found` });
      continue;
    }

    // TODO: conclude score on the basis of correct answer vs learner response

    const subSkillScores = calculateSubSkillScoresForQuestion(question, learner_response);

    /**
     * If an entry already exists for the (learner_id, question_id) pair, then we increment the attempt count & update the new values
     */
    const learnerDataExists = await getQuestionLevelDataByLearnerIdAndQuestionId(learner_id, question_id);
    if (!_.isEmpty(learnerDataExists)) {
      const updateData = {
        ...datum,
        sub_skills: subSkillScores,
        attempts_count: learnerDataExists.attempts_count + 1,
        updated_by: uuid.v4(), // TODO: replace with valid user id
      };
      await updateLearnerProficiencyQuestionLevelData(learnerDataExists.identifier, updateData);
      continue;
    }

    await createLearnerProficiencyQuestionLevelData({
      ...datum,
      identifier: uuid.v4(),
      learner_id,
      question_set_id: question.question_set_id,
      taxonomy: question.taxonomy,
      sub_skills: subSkillScores,
      created_by: uuid.v4(), // TODO: replace with valid user id
    });
  }

  /**
   * Updating question set level data in the following block
   */
  for (const questionSet of questionSets) {
    const totalQuestionsCount = await getQuestionsCountForQuestionSet(questionSet.identifier);
    const attemptedQuestions = await getRecordsForLearnerByQuestionSetId(learner_id, questionSet.identifier);
    const allQuestionsHaveEqualNumberOfAttempts = attemptedQuestions.every((question: { attempts_count: number }) => question.attempts_count === (attemptedQuestions?.[0]?.attempts_count || 0));
    if (totalQuestionsCount === attemptedQuestions.length && totalQuestionsCount > 0 && allQuestionsHaveEqualNumberOfAttempts) {
      const avgScore = calculateAvergaeScoreForQuestionSet(attemptedQuestions);
      const subSkillScores = calculateSubSkillScoresForQuestionSet(attemptedQuestions);
      /**
       * If an entry already exists for the (learner_id, question_set_id) pair, then we increment the attempt count
       */
      const learnerDataExists = await getQuestionSetLevelDataByLearnerIdAndQuestionSetId(learner_id, questionSet.identifier);
      if (!_.isEmpty(learnerDataExists)) {
        const updateData = {
          score: avgScore,
          sub_skills: subSkillScores,
          attempts_count: learnerDataExists.attempts_count + 1,
          updated_by: uuid.v4(), // TODO: replace with valid user id
        };
        await updateLearnerProficiencyQuestionSetLevelData(learnerDataExists.identifier, updateData);
        continue;
      }
      /**
       * If an entry does not exist for the (learner_id, question_set_id) pair, then we make an entry
       */
      await createLearnerProficiencyQuestionSetLevelData({
        identifier: uuid.v4(),
        learner_id,
        question_set_id: questionSet.identifier,
        taxonomy: questionSet.taxonomy,
        sub_skills: subSkillScores,
        score: avgScore,
        created_by: uuid.v4(), // TODO: replace with valid user id
      });
    }
  }

  // TODO: Aggregation DATA sync

  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: 'Learner data synced successfully' },
  });
};

export default learnerProficiencyDataSync;
