import {
  getDefaultSortOrder,
  GetListResponse,
  LayoutWrapper,
  List,
  parseTableParamsFromQuery,
  Table,
  useTable,
} from "@pankod/refine";
import { checkAuthentication } from "@pankod/refine-nextjs-router";
import dataProvider from "@pankod/refine-simple-rest";
import { GetServerSideProps } from "next";
import { FC } from "react";
import { authProvider } from "src/authProvider";
import { API_URL } from "src/constants";
import { IUser } from "src/interfaces";

const UserList: FC<{ users: GetListResponse<IUser> }> = ({ users }) => {
  const { tableProps, sorter } = useTable<IUser>({
    resource: "users",
    queryOptions: { initialData: users },
    syncWithLocation: true,
  });

  return (
    <LayoutWrapper>
      <List title="Users">
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title="ID"
            sorter={{ multiple: 1 }}
            defaultSortOrder={getDefaultSortOrder("id", sorter)}
          />
          <Table.Column
            dataIndex="firstName"
            title="Name"
            sorter={{ multiple: 2 }}
            defaultSortOrder={getDefaultSortOrder("firstName", sorter)}
          />
        </Table>
      </List>
    </LayoutWrapper>
  );
};

export default UserList;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isAuthenticated, ...props } = await checkAuthentication(
    authProvider,
    context
  );

  if (!isAuthenticated) {
    return props;
  }

  const { parsedCurrent, parsedPageSize, parsedSorter, parsedFilters } =
    await parseTableParamsFromQuery(context.query);

  const data = await dataProvider(API_URL).getList({
    resource: "users",
    filters: parsedFilters,
    pagination: {
      current: parsedCurrent || 1,
      pageSize: parsedPageSize || 1,
    },
    sort: parsedSorter,
  });

  return {
    props: { users: data },
  };
};
