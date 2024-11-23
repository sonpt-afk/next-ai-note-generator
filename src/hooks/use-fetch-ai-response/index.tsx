import { useState, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import styles from "./style.module.scss";

const useFetchAiResponse = (
  setAiResponse: Dispatch<SetStateAction<string>>
) => {
  const [loading, setLoading] = useState(false);

  const showToastError = (message: string) => {
    toast(
      <div className={styles.toast__wrapper}>
        <div className={styles.toast__title}>{message}</div>
      </div>,
      {
        duration: 5000,
      }
    );
  };

  const fetchAiResponse = async (data: { topic: string }) => {
    setLoading(true);
    setAiResponse("");
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ topic: data.topic }),
        headers: { "Content-type": "application/json" },
      });

      if (!response.ok || !response.body) {
        showToastError("Error Occurred");
        setLoading(false);
        return;
      }

      //logic for handling the streaming response starts here
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // run a loop while the reader has not stopped reading the streaming response.
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const text = decoder.decode(value, { stream: true });
          const cleanText = text
            .replace(/0:"/g, "")
            .replace(/",/g, "")
            .replace(/"/g, "");
          setAiResponse((prev) => prev + cleanText);
        }
      }
    } catch (error) {
      showToastError("Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  return { fetchAiResponse, loading };
};

export default useFetchAiResponse;
