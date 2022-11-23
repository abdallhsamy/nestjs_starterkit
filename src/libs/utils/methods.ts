// import ArabicTranslations from '../../languages/ar.json'
import { diskStorage } from 'multer';
import dataSource from "../../ormconfig";
import {generateFileName, imageFileFilter} from "./file-upload";

export const translate = ( word ) => {

  let locale = global.accept_lang || 'en';

  // if (  locale === 'ar' )
    // return ArabicTranslations[word] ?? word;
  // else // if the accept language is english
    return word

}

export const compareTwoArrays = ( arrayOne: [], arrayTwo: [],  keyOne: string = null, keyTwo: string = null, lengthMustMatch: boolean = true ) : boolean =>
{
  if ( lengthMustMatch && arrayOne.length !== arrayTwo.length )
    return false;

  if ( keyOne && keyTwo )
    return arrayOne.every( arrOneElement => arrayTwo.find( ( arrTwoElement) => arrTwoElement && arrTwoElement[ keyTwo ] == arrOneElement[ keyOne ] ) )
  else
    return arrayOne.every( arrOneElement => arrayTwo.find( ( arrTwoElement) => arrTwoElement == arrOneElement ) )
}

export const getCurrDate = () => {

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm: any = today.getMonth() + 1; // Months start at 0!
  let dd: any = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return  yyyy + '-' + mm + '-' + dd;

}

export const getAvailableTaxes = async () => {

  const currDate = getCurrDate();

  return await dataSource.query(`
      SELECT * FROM taxes
      where (
        status = 'active'
        AND starting_date <= '${ currDate }'
        AND ending_date >= '${ currDate }'
      )
  `);

}

export const calculateRoleTaxes = ( price: number ) => {

  // const sum  = global.available_taxes.reduce((accumulator, value) => {
  //   return accumulator + ( +value['percentage'] );
  // }, 0);
  //
  // return Math.round( ( sum / 100 ) * price );
  return 0;

}

export const getFileInterceptorObj = ( directory = '' ): Object => {
  if (process.env.FILE_SYSTEM_DRIVER === 'local') {
    return {
      storage: diskStorage({
        destination: './uploads/images' + directory ,
        filename: generateFileName,
      }),
      fileFilter: imageFileFilter,
    };
  } else {
    return {
      fileFilter: imageFileFilter,
    };
  }
};

export const getImageBasePath = (): string => {

  if (process.env.FILE_SYSTEM_DRIVER === 'local')
    return process.env.DASHBOARD_BASE_URL + 'storage/';
  else
    return process.env.AWS_URL;

};
