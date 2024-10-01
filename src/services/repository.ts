import { Op } from 'sequelize';
import { Repository } from '../models/repository';

export const checkRepositoryNameExists = async (repositoryNames: { [key: string]: string }): Promise<{ exists: boolean; repository?: any }> => {
  // Convert repositoryNames into conditions dynamically
  const conditions = Object.entries(repositoryNames).map(([lang, name]) => ({
    name: { [Op.contains]: { [lang]: name } }, // Check for each language dynamically
    is_active: true,
  }));

  // Query the repository using the dynamically created conditions
  const repository = await Repository.findOne({
    where: { [Op.or]: conditions },
    attributes: ['id', 'name'], // Fetch only the necessary fields
  });

  // Return the result, simplifying the access of attributes
  return repository ? { exists: true, repository: repository.toJSON() } : { exists: false };
};
