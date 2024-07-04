import { DetailedHTMLProps, HtmlHTMLAttributes, ReactNode } from 'react';

import { NumberType } from '../../components/ui/NumberFormat';

enum PeriodKeys {
  DAY = '24h',
  WEEK = '7d',
  MONTH = '30d',
}

export interface ZoneOverviewItemProps
  extends DetailedHTMLProps<HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  defaultLoadingValue?: string;
  loading?: boolean;
  numberType?: NumberType;
  period?: PeriodKeys;
  rowDirection?: boolean;
  title: string;
  tooltipText?: string;
  value?: number | null;
}
