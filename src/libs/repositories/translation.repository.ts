import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export default class TranslationRepository<Entity> extends Repository<Entity> {
  static async setTranslations(
    translations: any[],
    translationRepository: Repository<any>,
    foreign_key,
    foreign_id,
  ) {
    for await (const translation of translations) {
      const translationRecord = translationRepository.create(translation);
      translationRecord[foreign_key] = foreign_id;
      await translationRepository.save(translationRecord);
    }
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
