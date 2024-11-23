"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-input";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./style.module.scss";
import { Dispatch, FC, SetStateAction } from "react";
import useFetchAiResponse from "@/hooks/use-fetch-ai-response";

// First update the FormSchema
const FormSchema = z
  .object({
    topic: z.string().nullable(),
    customTopic: z.string().optional(),
  })
  .refine(
    (data) => {
      // Either topic or customTopic must be filled
      return (
        data.topic !== null || (data.customTopic && data.customTopic.length > 0)
      );
    },
    {
      message: "Please either select a topic or enter a custom one",
    }
  );

interface Props {
  setAiResponse: Dispatch<SetStateAction<string>>;
}

const SelectForm: FC<Props> = ({ setAiResponse }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: "",
      customTopic: "",
    },
  });

  const { fetchAiResponse } = useFetchAiResponse(setAiResponse);

  // In SelectForm component
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("input", data);
    // Use customTopic if topic is empty or 'none', otherwise use selected topic
    const topicToUse = {
      topic:
        !data.topic || data.topic === "none" ? data.customTopic : data.topic,
    };

    await fetchAiResponse(topicToUse);

    // Reset form fields
    form.setValue("customTopic", "");
    if (data.topic !== "none") {
      form.setValue("topic", "");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {form.getValues().topic
                  ? `topic selected: ${form.getValues().topic}`
                  : "Select Topic"}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic to generate short notes" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Artificial Intelligence">
                    Artificial Intelligence
                  </SelectItem>
                  <SelectItem value="Javascript">Javascript</SelectItem>
                  <SelectItem value="Machine Learning">
                    Machine Learning
                  </SelectItem>
                  <SelectItem value="none">None (Use custom input)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customTopic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Topic</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""} // Ensure value is never undefined
                  placeholder="Enter your topic..."
                  disabled={
                    form.watch("topic") && form.watch("topic") !== "none"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={
            !form.formState.isValid ||
            form.formState.isSubmitting ||
            (form.watch("topic") === "none" && !form.watch("customTopic"))
          }
        >
          {form.formState.isSubmitting ? (
            <div className={styles.loading}>Generating...</div>
          ) : (
            "Generate Short Note!"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SelectForm;
