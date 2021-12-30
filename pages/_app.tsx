import React from "react";
import { AppProps } from "next/app";

import { Refine } from "@pankod/refine";
import routerProvider from "@pankod/refine-nextjs-router";

import "@pankod/refine/dist/styles.min.css";
import dataProvider from "@pankod/refine-simple-rest";
import { PostCreate, PostEdit, PostList, PostShow } from "@components/posts";
import { authProvider } from "src/authProvider";
import { API_URL } from "src/constants";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Refine
      authProvider={authProvider}
      routerProvider={routerProvider}
      dataProvider={dataProvider(API_URL)}
      warnWhenUnsavedChanges={true}
      resources={[
        { name: "users" },
        {
          name: "posts",
          list: PostList,
          show: PostShow,
          edit: PostEdit,
          create: PostCreate,
          canDelete: true,
        },
      ]}
    >
      <Component {...pageProps} />
    </Refine>
  );
}

export default MyApp;
