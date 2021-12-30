import {
  List,
  Table,
  TagField,
  DateField,
  EditButton,
  DeleteButton,
  useTable,
  ShowButton,
  Space,
} from "@pankod/refine";
import React from "react";
import { ICategory } from "../../interfaces";

export const CategoryList: React.FC = () => {
  const { tableProps } = useTable<ICategory>();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title="title" />
        <Table.Column<ICategory>
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
