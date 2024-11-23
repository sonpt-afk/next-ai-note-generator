import React, { FC } from "react";
import styles from "./style.module.scss";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  aiResponse: string;
}

const ContentArea: FC<Props> = ({ aiResponse }) => {
  return (
    <div className={styles.content_root}>
      {aiResponse ? (
        <Markdown remarkPlugins={[remarkGfm]}>{aiResponse}</Markdown>
      ) : (
        <div className={styles.no_response}>
          Response from Ai Will Appear Here!
        </div>
      )}
    </div>
  );
};

export default ContentArea;
