export const initiateSocialLogin = (provider:any, redirectPath = '/') => {
  const baseUrl = window.location.origin; // exemplo: http://localhost:3000 ou https://flexybot.com.br
  const fullRedirect = `${baseUrl}${redirectPath}`;
  const encodedRedirect = encodeURIComponent(fullRedirect);

  window.location.href = `https://anotadoai.com.br/agendei-api/v1/auth/${provider}-login?redirect_uri=${encodedRedirect}`;

};
