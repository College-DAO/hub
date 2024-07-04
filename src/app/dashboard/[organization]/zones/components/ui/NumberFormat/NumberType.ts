export enum NumberType {
  Currency = 'currency',
  Number = 'number',
  Percent = 'percent',
}

export const NUMBER_STYLE_MAP = {
  [NumberType.Currency]: 'currency',
  [NumberType.Number]: 'decimal',
  [NumberType.Percent]: 'percent',
};
