import { Like } from 'typeorm';
import dataSource from '@src/ormconfig';

// this function transform filters sent by user to object to make a query
export const manipulateFiltersParams = (filters: Object): Object => {
  const manipulatedFilters = {};

  if (filters['equals'])
    // check if there are keys sent to be filtered by exact match criteria
    for (const [key, value] of Object.entries(filters['equals']))
      manipulatedFilters[key] = value;

  if (filters['likes'])
    // check if there are keys sent to be filtered by some match criteria ( where like )
    for (const [key, value] of Object.entries(filters['likes']))
      if (typeof value === 'object')
        // check if the search in nested object ( relation )
        for (const [k, val] of Object.entries(value))
          manipulatedFilters['translations'] = { [k]: Like(`%${val}%`) };
      else manipulatedFilters[key] = value;

  return manipulatedFilters;
};
// this function transform filters sent by user to object to make a query

export const checkForeignKeyExistence = async (
  entries: Object[],
): Promise<Object> => {
  // await source.initialize();

  const errors = {};

  const getResults = new Promise((resolve, reject) => {
    let index = 0;

    entries.forEach(async (entry) => {
      const records = await dataSource.query(
        `SELECT id FROM ${entry['tableName']} WHERE id = "${entry['value']}"`,
      );

      if (records.length === 0)
        errors[entry['key']] = [
          `The ${entry['key']} with value ${entry['value']} doesnt exist in ${entry['tableName']} table`,
        ];

      if (index++ == entries.length - 1) resolve(Object.keys(errors).length);
    });
  });

  return new Promise((resolve, reject) => {
    getResults.then((errorsCount) => resolve(errors));
  });
};

export const translation = (key, translations: any[]) => {
  let translationObj = translations.find(
    (translation) =>
      translation['lang'] == global.accept_lang && translation[key] != null,
  );

  if (translationObj) return translationObj[key];

  translationObj = translations.find((translation) => translation[key] != null); // find first translation where the [ key ] is not empty with any lang

  if (translationObj) return translationObj[key];
  else return null;
};

export const isUnique = async (entries: Object[]): Promise<Object> => {
  const errors = {};

  const getResults = new Promise((resolve, reject) => {
    let index = 0;

    entries.forEach(async (entry) => {
      const records = await dataSource.query(
        `SELECT id FROM ${entry['tableName']} WHERE ${entry['key']} = "${entry['value']}"`,
      );

      if (records.length !== 0)
        errors[entry['key']] = [
          `The ${entry['key']} with value ${entry['value']} is already taken in ${entry['tableName']} table`,
        ];

      if (index++ == entries.length - 1) resolve(Object.keys(errors).length);
    });
  });

  return new Promise((resolve, reject) => {
    getResults.then((errorsCount) => resolve(errors));
  });
};
