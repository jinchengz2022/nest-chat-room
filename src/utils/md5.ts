import * as crypo from 'crypto';

export const md5 = (value: string) => {
  const hash = crypo.createHash('md5');
  hash.update(value);
  return hash.digest('hex');
};
