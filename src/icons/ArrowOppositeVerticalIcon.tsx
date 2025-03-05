import { FC } from 'react';

type IArrowDownIcon = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

const ArrowOppositeVerticalIcon: FC<IArrowDownIcon> = ({ size = 24, ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" {...restProps}>
      <path
        d="M13 14.6V3c0-.6.4-1 1-1s1 .4 1 1v11.6l1.3-1.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-3 3c-.4.4-1 .4-1.4 0l-3-3c-.2-.2-.3-.4-.3-.7 0-.3.1-.5.3-.7.4-.4 1-.4 1.4 0l1.3 1.3ZM7 5.4V17c0 .6-.4 1-1 1s-1-.4-1-1V5.4L3.7 6.7c-.4.4-1 .4-1.4 0-.2-.2-.3-.4-.3-.7 0-.3.1-.5.3-.7l3-3c.4-.4 1-.4 1.4 0l3 3c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0L7 5.4Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ArrowOppositeVerticalIcon;
