import {
  List,
  TextField,
  TagField,
  DateField,
  Table,
  useTable,
  useMany,
  useSelect,
  FilterDropdown,
  Select,
  ShowButton,
  EditButton,
  Space,
  DeleteButton,
  IResourceComponentsProps,
  GetListResponse,
  useCan,
  NumberField,
} from "@pankod/refine";

import { ICategory, IPost } from "../../interfaces";

export const PostList: React.FC<
  IResourceComponentsProps<GetListResponse<IPost>>
> = ({ initialData }) => {
  const { tableProps } = useTable<IPost>({
    queryOptions: { initialData },
    syncWithLocation: true,
  });

  const categoryIds =
    tableProps?.dataSource?.map((item) => item.category.id) ?? [];
  const { data: categoriesData, isLoading } = useMany<ICategory>({
    resource: "categories",
    ids: categoryIds,
    queryOptions: {
      enabled: categoryIds.length > 0,
    },
  });
  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const { data: canAccess } = useCan({
    resource: "posts",
    action: "field",
    params: { field: "hit" },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title="title" />
        <Table.Column
          dataIndex="status"
          title="status"
          render={(value) => <TagField value={value} />}
        />
        <Table.Column
          dataIndex="createdAt"
          title="createdAt"
          render={(value) => <DateField format="LLL" value={value} />}
        />
        {canAccess?.can && (
          <Table.Column
            dataIndex="hit"
            title="Hit"
            render={(value: number) => (
              <NumberField value={value} options={{ notation: "compact" }} />
            )}
          />
        )}
        <Table.Column
          dataIndex={["category", "id"]}
          title="category"
          render={(value) => {
            if (isLoading) {
              return <TextField value="Loading..." />;
            }

            return (
              <TextField
                value={
                  categoriesData?.data.find((item) => item.id === value)?.title
                }
              />
            );
          }}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ minWidth: 200 }}
                mode="multiple"
                placeholder="Select Category"
                {...categorySelectProps}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IPost>
          title="Actions"
          dataIndex="actions"
          render={(_text, record): React.ReactNode => {
            return (
              <Space>
                <ShowButton size="small" recordItemId={record.id} hideText />
                <EditButton size="small" recordItemId={record.id} hideText />
                <DeleteButton size="small" recordItemId={record.id} hideText />
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};
