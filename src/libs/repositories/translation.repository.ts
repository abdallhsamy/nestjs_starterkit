import { Repository } from "typeorm";

export default class TranslationRepository<Entity> extends Repository<Entity> {

  static async setTranslations( translations: any[] , translationRepository: Repository<any> , foreignKeyName , foreignKeyVal )
  {
    for await (const translation of translations)
    {
      const translationRecord = translationRepository.create(translation);
      translationRecord[ foreignKeyName ] = foreignKeyVal;
      await translationRepository.save(translationRecord)
    }
  }

  static async updateTranslations( translations: any[] , translationRepository: Repository<any> )
  {

    for await (const translation of translations)
    {
       const { id , ...data } = translation;
       await translationRepository.update( id , data);
    }

  }

}