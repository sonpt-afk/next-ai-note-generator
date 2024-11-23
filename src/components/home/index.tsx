"use client";
import styles from "./style.module.scss";
import SelectForm from "../select-form";
import ContentArea from "../content-area/index";
import { useState } from "react";
import { Button } from "../ui/button";

const Home = () => {
  //state to set response from AI
  const [aiResponse, setAiResponse] = useState("");

  return (
    <>
      <h1 className={styles.title}>
        Generate AI Powered Short Notes, In Just One Click
      </h1>
      <div className={styles.container}>
        <h3 className={styles.subtitle}>Choose a Topic: </h3>
        <SelectForm setAiResponse={setAiResponse} />
        <ContentArea aiResponse={aiResponse} />
        <Button
          onClick={() => setAiResponse("")}
          disabled={!aiResponse}
          className={styles.reset_button}
        >
          Reset{" "}
        </Button>
      </div>
    </>
  );
};

export default Home;
