/* eslint-disable no-useless-escape */

const regex = {
  cpfRegex: /[0-9]{11}/,
  nameRegex: /([A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]){3,}/,
  emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  passwordRegex: /^(?=.{6,})(?!.*\s).*$/,
  phoneRegex1: /[0-9]{11}/,
  phoneRegex2: /[0-9]{10}/,
};

export default regex;
