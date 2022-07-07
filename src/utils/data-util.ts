export const numberParseEnvData = (environmentVariable?: string) => {
  return (environmentVariable && parseFloat(environmentVariable)) || 0;
};
