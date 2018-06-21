export const convertingJSONToString = (profileJSON) => {
    // Converting profile JSON to profile string received from Nuvem Civica.
    const profileStringDoubleQuote = JSON.stringify(profileJSON);
  
    // Changing " to '.
    const profileStringSingleQuote = profileStringDoubleQuote.replace(/"/g, "'");
  
    return profileStringSingleQuote;
};