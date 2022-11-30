import { Repository } from 'typeorm';

export default class TranslationRepository<Entity> extends Repository<Entity> {
  static async setTranslations(
    translations: any[],
    translationRepository: Repository<any>,
    foreign_key,
    foreign_id,
  ) {
    // start creating records
    const translationRecords = translationRepository.create(translations);

    // map translations for creating them
    const translationsRequest = [];
    for (const translationRecord of translationRecords) {
      translationRecord[foreign_key] = foreign_id;
      translationsRequest.push(translationRecord);
    }

    await translationRepository.save(translationsRequest);
  }

  static async updateTranslations(
    foreign_key: string,
    foreign_id: number,
    translations: any[],
    translationRepository: Repository<any>,
  ) {
    for await (const translation of translations) {
      const condition = { lang: translation.lang };

      condition[foreign_key] = foreign_id;

      const translatable_item = await translationRepository.findOneBy(
        condition,
      );

      if (translatable_item) {
        await translationRepository.update(translatable_item.id, translation);
      } else {
        await this.setTranslations(
          [translation],
          translationRepository,
          foreign_key,
          foreign_id,
        );
      }
    }
  }
}
