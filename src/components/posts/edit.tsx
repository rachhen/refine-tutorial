import {
  useForm,
  Form,
  Input,
  Select,
  Edit,
  useSelect,
  Alert,
  ListButton,
  RefreshButton,
} from "@pankod/refine";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

import { IPost } from "../../interfaces";

export const PostEdit: React.FC = () => {
  const [deprecated, setDeprecated] = useState<
    "deleted" | "updated" | undefined
  >();
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  const { formProps, saveButtonProps, queryResult } = useForm<IPost>({
    liveMode: "manual",
    onLiveEvent: (event) => {
      if (event.type === "deleted" || event.type === "updated") {
        setDeprecated(event.type);
      }
    },
  });

  const handleRefresh = () => {
    queryResult?.refetch();
    setDeprecated(undefined);
  };

  const { selectProps: categorySelectProps } = useSelect<IPost>({
    resource: "categories",
    defaultValue: queryResult?.data?.data?.category.id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      {deprecated === "deleted" && (
        <Alert
          message="This post is deleted."
          type="warning"
          style={{ marginBottom: 20 }}
          action={<ListButton size="small" />}
        />
      )}
      {deprecated === "updated" && (
        <Alert
          message="This post is updated. Refresh to see changes."
          type="warning"
          style={{ marginBottom: 20 }}
          action={<RefreshButton size="small" onClick={handleRefresh} />}
        />
      )}
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
        <Form.Item
          label="Content"
          name="content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <ReactMde
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
            }
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
