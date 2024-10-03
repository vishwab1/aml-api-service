import { Question } from './question';
import { QuestionSet } from './questionSet';

// Define associations
Question.belongsTo(QuestionSet, { foreignKey: 'question_set_id', targetKey: 'identifier', as: 'question_set' });
QuestionSet.hasMany(Question, { foreignKey: 'question_set_id', sourceKey: 'identifier', as: 'questions' });
