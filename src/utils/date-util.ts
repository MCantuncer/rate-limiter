import moment from 'moment';

export const unixToDate = (unixData: number): string => {
  return moment.unix(unixData).format('DD/MM/YYYY HH:mm:ss');
};
