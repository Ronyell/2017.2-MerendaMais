import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { POSTS_LINK_NUVEM_CIVICA, INSPECTION_POSTING_TYPE_CODE, APP_IDENTIFIER, COMMON_COUNSELOR } from '../constants/generalConstants';
import { SET_CURRENT_REPORT_RESULT, SET_CURRENT_REPORT_RESULT_FOOD_STOCKS, SET_CURRENT_REPORT_RESULT_DOC, SET_CURRENT_REPORT_RESULT_FOOD_QUALITY, SET_CURRENT_REPORT_RESULT_FOOD_HANDLER, SET_CURRENT_REPORT_RESULT_WATER_SEWER_SUPPLY, SET_CURRENT_REPORT_RESULT_KITCHEN, SET_CURRENT_REPORT_RESULT_FOOD_PREPARATION, SET_CURRENT_REPORT_RESULT_OTHER_OBSERVATION, SET_CURRENT_REPORT_RESULT_REFECTORY, SET_CURRENT_REPORT_RESULT_SCHOOL_SURROUNDINGS } from './types';
import { convertingContentStringToJSON } from './schedulingVisitActions';

import foodStock from '../constants/reports/foodStock';
import refectory from '../constants/reports/refectory';
import kitchen from '../constants/reports/kitchen';
import foodQuality from '../constants/reports/foodQuality';
import foodHandler from '../constants/reports/foodHandler';
import waterSewerSupply from '../constants/reports/waterSewerSupply';
import foodPreparation from '../constants/reports/foodPreparation';
import doc from '../constants/reports/doc';
import schoolSurroundings from '../constants/reports/schoolSurroundings';
import { logWarn } from '../../logConfig/loggers';
import { treatingPostsError } from './schedulingMeetingActions';

const FILE_NAME = 'reportResultActions.js';

export const setCurrentReportResultRefectory = reportResult => ({
  type: SET_CURRENT_REPORT_RESULT_REFECTORY,
  payload: reportResult,
});  

export const setCurrentReportResultSchoolSurroundings = reportResult => ({
    type: SET_CURRENT_REPORT_RESULT_SCHOOL_SURROUNDINGS,
    payload: reportResult,
});  

export const setCurrentReportResultFoodStocks = reportResult => ({
    type: SET_CURRENT_REPORT_RESULT_FOOD_STOCKS,
    payload: reportResult,
}); 

export const setCurrentReportResultDoc = reportResult => ({
    type: SET_CURRENT_REPORT_RESULT_DOC,
    payload: reportResult,
}); 

export const setCurrentReportResultFoodQuality = reportResult => ({
    type: SET_CURRENT_REPORT_RESULT_FOOD_QUALITY,
    payload: reportResult,
}); 

export const setCurrentReportResultFoodHandler = reportResult => ({
    type: SET_CURRENT_REPORT_RESULT_FOOD_HANDLER,
    payload: reportResult,
}); 

export const setCurrentReportResultWaterSewerSupply = reportResult => ({
    type: SET_CURRENT_REPORT_RESULT_WATER_SEWER_SUPPLY,
    payload: reportResult,
}); 

export const setCurrentReportResultKitchen = reportResult => ({
    type: SET_CURRENT_REPORT_RESULT_KITCHEN,
    payload: reportResult,
}); 

export const setCurrentReportResultFoodPreparation = reportResult => ({
    type: SET_CURRENT_REPORT_RESULT_FOOD_PREPARATION,
    payload: reportResult,
}); 

export const setCurrentReportResultOtherObservation = reportResult => ({
    type: SET_CURRENT_REPORT_RESULT_OTHER_OBSERVATION,
    payload: reportResult,
}); 

export const asyncGetCurrentPost = (getData) => async (dispatch) => {
    const header = {
      headers: {
        appToken: getData.appToken
      },
      params: {
        codPostagemRelacionada: getData.codPostagem,
        codTiposPostagem: INSPECTION_POSTING_TYPE_CODE,
        appIdentifier: APP_IDENTIFIER,
      }
    };
    try{
      const response = await axios.get(POSTS_LINK_NUVEM_CIVICA, header);
        return Promise.all (
          (response.data[0].conteudos.map((item) => {
            return (getContentInPost(getData ,item, dispatch));
          }))
        );
    } catch (error) {
      logWarn(FILE_NAME, 'reportResult',
      `Request result in an ${error}`);
      treatingPostsError(error);
    }
  }
  
export const getContentInPost = async (getData, item, dispatch)  => {
  const header = {
    headers: {
      appToken: getData.appToken
    }
  };
  try{
    const response = await axios.get(item.links[0].href, header);
    return extractJson(convertingContentStringToJSON(response.data.JSON), dispatch);
  } catch (error) {
    logWarn(FILE_NAME, 'reportResult',
      `Request result in an ${error}`);
    treatingPostsError(error);
  }
}

export const extractJson = async (json, dispatch) => {
  switch(json.nameOfVerificationList) {
    case 'Refeitório': {
      const reportResultRefectory = {
        questions: getQuestions(json, refectory),
        status: json.wasConcluded,
        textObservation: json.textObservation,
      }
      dispatch(setCurrentReportResultRefectory(reportResultRefectory));
      break;
    }
    case 'Arredores da Escola': {
      const reportResultSchoolSurroundings = {
        questions: getQuestions(json, schoolSurroundings),
        status: json.wasConcluded,
        textObservation: json.textObservation,
      }
      dispatch(setCurrentReportResultSchoolSurroundings(reportResultSchoolSurroundings));
      break;
    }
    case 'Abastecimento de Água e Esgoto': {
      const reportResultWaterSewerSupply = {
        questions: getQuestions(json, waterSewerSupply),
        status: json.wasConcluded,
        textObservation: json.textObservation,
      }
      dispatch(setCurrentReportResultWaterSewerSupply(reportResultWaterSewerSupply));
      break;
    }
    case 'Manipuladores de Alimentos': {
      const reportResultFoodHandler = {
        questions: getQuestions(json, foodHandler),
        status: json.wasConcluded,
        textObservation: json.textObservation,
      }
      dispatch(setCurrentReportResultFoodHandler(reportResultFoodHandler));
      break;
    }
    case 'Documentação': {
      const reportResultDoc = {
        questions: getQuestions(json, doc),
        status: json.wasConcluded,
        textObservation: json.textObservation,
      }
      dispatch(setCurrentReportResultDoc(reportResultDoc));
      break;
    }
    case 'Preparação e Distribuição de Alimentos': {
      const reportResultFoodPreparation = {
        questions: getQuestions(json, foodPreparation),
        status: json.wasConcluded,
        textObservation: json.textObservation,
      }
      dispatch(setCurrentReportResultFoodPreparation(reportResultFoodPreparation));
      break;
    }
    case 'Estoque de Alimentos': {
      const reportResultFoodStock = {
        questions: getQuestions(json, foodStock),
        status: json.wasConcluded,
        textObservation: json.textObservation,
      }
      dispatch(setCurrentReportResultFoodStocks(reportResultFoodStock));
      break;
    }
    case 'Cozinha': {
      const reportResultKitchen = {
        questions: getQuestions(json, kitchen),
        status: json.wasConcluded,
        textObservation: json.textObservation,
      }
      dispatch(setCurrentReportResultKitchen(reportResultKitchen));
      break;
    }
    case 'Qualidade de Alimento': {
      const reportResultFoodQuality = {
        questions: getQuestions(json, foodQuality),
        status: json.wasConcluded,
        additionalData: json.additionalData,
      }
      dispatch(setCurrentReportResultFoodQuality(reportResultFoodQuality));
      break;
    }
    case 'Outras observações': {
      const reportResultObservation = {
        status: json.wasConcluded,
        textObservation: json.textObservation,
      }
      dispatch(setCurrentReportResultOtherObservation(reportResultObservation));
      break;
    }
  }
} 

export const getQuestions = (json, baseQuestions) => {
  const questions = baseQuestions.map((item) => {
    const questionBody = json.binaryQuestions[item.question];
    const question = {
      ...questionBody,
      label: item.label,
    };
    return question;
  })
  return questions;
}

