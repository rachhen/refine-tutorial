import { GetServerSideProps } from "next";
import { checkAuthentication } from "@pankod/refine-nextjs-router";
export { NextRouteComponent as default } from "@pankod/refine-nextjs-router";
import dataProvider from "@pankod/refine-simple-rest";

import { authProvider } from "src/authProvider";
import { API_URL } from "src/constants";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isAuthenticated, ...props } = await checkAuthentication(
    authProvider,
    context
  );

  if (!isAuthenticated) {
    return props;
  }

  const { query } = context;

  try {
    const data = await dataProvider(API_URL).getList({
      resource: query["resource"] as string,
    });

    return {
      props: {
        initialData: data,
      },
    };
  } catch (error) {
    return { props: {} };
  }
};
