import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

import { ElementSize } from '~/app/dashboard/[organization]/zones//types/ElementSize';

export interface ButtonGroupItem<T> {
  key?: T;
  title?: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string | undefined }>;
}

export interface ButtonGroupProps<T>
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  buttons?: ButtonGroupItem<T>[];
  className?: string;
  children?: ReactNode;
  isActive?: (key: string) => boolean;
  setSelectedButton?: (item: ButtonGroupItem<T>) => void;
  size?: ElementSize;
}
