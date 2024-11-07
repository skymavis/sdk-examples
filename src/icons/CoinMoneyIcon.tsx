import { FC } from 'react';

type ICoinMoneyIcon = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

const CoinMoneyIcon: FC<ICoinMoneyIcon> = ({ size = 24, ...restProps }) => {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...restProps}>
      <path
        fill="currentColor"
        d="M10 8.667c4.418 0 8-1.493 8-3.334C18 3.493 14.418 2 10 2S2 3.492 2 5.333c0 1.841 3.582 3.334 8 3.334Z"
      />
      <path
        fill="currentColor"
        d="M16.163 9.588c-1.67.696-3.859 1.079-6.163 1.079-2.304 0-4.493-.383-6.163-1.08C3.073 9.27 2.471 8.908 2 8.525v1.41c0 .89.832 1.727 2.343 2.356 1.511.63 3.52.977 5.657.977s4.146-.347 5.657-.977C17.167 11.66 18 10.824 18 9.933v-1.41c-.471.385-1.073.746-1.837 1.065Z"
      />
      <path
        fill="currentColor"
        d="M10 15.267c2.304 0 4.493-.384 6.163-1.08.764-.318 1.366-.68 1.837-1.063v1.543C18 16.507 14.418 18 10 18s-8-1.492-8-3.333v-1.543c.471.383 1.073.745 1.837 1.064 1.67.695 3.859 1.079 6.163 1.079Z"
      />
    </svg>
  );
};

export default CoinMoneyIcon;
