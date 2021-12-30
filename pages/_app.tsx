import React, { useState } from "react";
import { AppProps } from "next/app";
import nookies from "nookies";

import { Refine, usePermissions } from "@pankod/refine";
import dataProvider from "@pankod/refine-simple-rest";
import routerProvider from "@pankod/refine-nextjs-router";
import { liveProvider } from "@pankod/refine-ably";
import { newEnforcer } from "casbin.js";
import "@pankod/refine/dist/styles.min.css";

import { authProvider } from "src/authProvider";
import { API_URL } from "src/constants";
import { PostCreate, PostEdit, PostList, PostShow } from "@components/posts";
import { CategoryList } from "@components/categories";
import { adapter, model } from "src/accessControl";
import { ablyClient } from "src/utility/ablyClient";
import { CustomSider } from "@components/slider";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Refine
      authProvider={authProvider}
      routerProvider={routerProvider}
      dataProvider={dataProvider(API_URL)}
      warnWhenUnsavedChanges={true}
      liveProvider={liveProvider(ablyClient)}
      liveMode="auto"
      Sider={CustomSider}
      accessControlProvider={{
        can: async ({ resource, action, params }) => {
          const auth = nookies.get()["auth"];
          const roles = auth ? JSON.parse(auth).roles : [];
          const role = roles[0] ?? "";

          const enforcer = await newEnforcer(model, adapter);
          if (action === "delete" || action === "edit" || action === "show") {
            const can = await enforcer.enforce(
              role,
              `${resource}/${params.id}`,
              action
            );
            return Promise.resolve({ can });
          }

          if (action === "field") {
            const can = await enforcer.enforce(
              role,
              `${resource}/${params.field}`,
              action
            );
            return Promise.resolve({ can });
          }

          const can = await enforcer.enforce(role, resource, action);
          return Promise.resolve({ can });
        },
      }}
      resources={[
        { name: "users" },
        { name: "categories", list: CategoryList },
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
