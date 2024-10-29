import Typography from "@components/typography/Typography";
import React, { FC } from "react";

import styles from "./Intro.module.scss";

const Intro: FC = () => {
  return (
    <div className={styles.intro}>
      <Typography size={"large"} bold>
        TantoKit <span className={styles.subtitle}>by Ronin</span>
      </Typography>

      <Typography size={"small"}>
        TantoKit is a powerful library designed to simplify the management of
        wallet connections for Ronin DApps, providing seamless integration and
        enhanced user experience.
      </Typography>
    </div>
  );
};

export default Intro;
