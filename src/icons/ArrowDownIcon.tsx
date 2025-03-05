import { FC } from 'react';

type IArrowDownIcon = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

const ArrowDownIcon: FC<IArrowDownIcon> = ({ size = 24, ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" {...restProps}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.47 7.47a.75.75 0 0 1 1.06 0L10 10.94l3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default ArrowDownIcon;
