import Button from '@components/button/Button';
import Typography from '@components/typography/Typography';
import { Input, Switch } from '@nextui-org/react';
import { isAddress } from 'ethers/lib/utils';
import React, { FC, useState } from 'react';

import styles from './LPTokenLogoGenerator.module.scss';

const LpTokenLogoGenerator: FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [token1Address, setToken1Address] = useState('');
  const [token2Address, setToken2Address] = useState('');
  const [token1IsRON, setToken1IsRON] = useState(false);
  const [token2IsRON, setToken2IsRON] = useState(false);

  const [errorMessage, setErrorMessageg] = useState('');

  const isValidInput =
    (isAddress(token1Address) || token1IsRON) &&
    (isAddress(token2Address) || token2IsRON) &&
    token1Address !== token2Address &&
    !(token1IsRON && token2IsRON);

  const drawRoundedImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number,
  ) => {
    ctx.save(); // Save the canvas state
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI); // Circular clipping path
    ctx.closePath();
    ctx.clip(); // Apply clipping region
    ctx.drawImage(img, x, y, size, size); // Draw the image
    ctx.restore(); // Restore the canvas state
  };

  const drawLogo = (e: any) => {
    e.preventDefault();
    if (!isValidInput) {
      return;
    }
    setErrorMessageg('');
    const token1ImageUrl = token1IsRON
      ? `https://cdn.skymavis.com/ronin/2020/ron/logo.png`
      : `https://cdn.skymavis.com/ronin/2020/erc20/${token1Address.toLocaleLowerCase()}/logo.png`;
    const token2ImageUrl = token2IsRON
      ? `https://cdn.skymavis.com/ronin/2020/ron/logo.png`
      : `https://cdn.skymavis.com/ronin/2020/erc20/${token2Address.toLocaleLowerCase()}/logo.png`;

    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (!context) {
        return;
      }
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const img = new Image();
      img.onload = function () {
        drawRoundedImage(context, img, 0, 115, 282);

        context.globalCompositeOperation = 'destination-out';
        context.beginPath();
        context.arc(370, 255, 159, 0, 2 * Math.PI, false);
        context.fillStyle = 'rgba(0, 0, 0, 1)';
        context.fill();
        context.globalCompositeOperation = 'source-over';

        const img2 = new Image();
        img2.onload = function () {
          drawRoundedImage(context, img2, 230, 115, 282);
        };
        img2.onerror = e => {
          console.error(e);
          setErrorMessageg('Cannot load token 2 logo');
        };
        img2.src = token2ImageUrl;
      };

      img.onerror = e => {
        console.error(e);
        setErrorMessageg('Cannot load token 1 logo');
      };

      img.src = token1ImageUrl;
    }
  };
  return (
    <div className={styles.logoGenerator}>
      <div className={styles.content}>
        <form onSubmit={drawLogo} className={styles.form}>
          <Typography size="xLarge">LP Token Logo Generator</Typography>
          <Input
            size="lg"
            variant="bordered"
            labelPlacement="outside"
            isClearable
            className={styles.inputContainer}
            onClear={() => setToken1Address('')}
            label={
              <div className={styles.inputLabel}>
                Token 1{' '}
                <Switch
                  checked={token1IsRON}
                  onChange={() => {
                    setToken1IsRON(state => !state);
                  }}
                >
                  Use Ron logo
                </Switch>
              </div>
            }
            isDisabled={token1IsRON}
            value={token1Address}
            onChange={e => setToken1Address(e.target.value)}
            type="text"
            placeholder="Token 1 address"
          />
          <Input
            size="lg"
            variant="bordered"
            labelPlacement="outside"
            isClearable
            onClear={() => setToken2Address('')}
            className={styles.inputContainer}
            label={
              <div className={styles.inputLabel}>
                Token 2{' '}
                <Switch
                  checked={token2IsRON}
                  onChange={() => {
                    setToken2IsRON(state => !state);
                  }}
                >
                  Use Ron logo
                </Switch>
              </div>
            }
            isDisabled={token2IsRON}
            value={token2Address}
            onChange={e => setToken2Address(e.target.value)}
            type="text"
            placeholder="Token 2 address"
          />
          <Button size="lg" isDisabled={!isValidInput} color="primary" type="submit">
            Generate logo
          </Button>
          {errorMessage}
        </form>
        <canvas ref={canvasRef} width={512} height={512} />
        <Typography color="warning">To download the image: right-click and select 'Save Image As...'</Typography>
      </div>
    </div>
  );
};

export default LpTokenLogoGenerator;
