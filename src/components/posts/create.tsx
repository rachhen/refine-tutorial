import {
  Create,
  Form,
  Input,
  Select,
  useForm,
  useSelect,
} from "@pankod/refine";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

import { IPost } from "../../interfaces";

export const PostCreate = () => {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const { formProps, saveButtonProps } = useForm<IPost>();
  const { selectProps: categorySelectProps } = useSelect<IPost>({
    resource: "categories",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select
            options={[
              {
                label: "Published",
                value: "published",
              },
              {
                label: "Draft",
                value: "draft",
              },
              {
                label: "Rejected",
                value: "rejected",
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Category" name={["category", "id"]}>
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item label="Content" name="content" rules={[{ required: true }]}>
          <ReactMde
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
            }
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
