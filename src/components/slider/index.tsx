import React, { useState } from "react";
import {
  AntdLayout,
  Menu,
  useMenu,
  useTitle,
  useNavigation,
  Grid,
  Icons,
  useLogout,
  useSubscription,
  Badge,
} from "@pankod/refine";
import { antLayoutSider, antLayoutSiderMobile } from "./styles";

export const CustomSider: React.FC = () => {
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const Title = useTitle();
  const { menuItems, selectedKey } = useMenu();
  const breakpoint = Grid.useBreakpoint();
  const { push } = useNavigation();
  const { mutate: logout } = useLogout();

  const isMobile = !breakpoint.lg;
  useSubscription({
    channel: "resources/posts",
    types: ["created", "updated"],
    onLiveEvent: () => setSubscriptionCount((prev) => prev + 1),
  });

  return (
    <AntdLayout.Sider
      collapsible
      collapsedWidth={isMobile ? 0 : 80}
      collapsed={collapsed}
      breakpoint="lg"
      onCollapse={(collapsed: boolean): void => setCollapsed(collapsed)}
      style={isMobile ? antLayoutSiderMobile : antLayoutSider}
    >
      <Title collapsed={collapsed} />
      <Menu
        selectedKeys={[selectedKey]}
        mode="inline"
        onClick={({ key }) => {
          if (key === "logout") {
            logout();
            return;
          }

          if (key === "/posts") {
            setSubscriptionCount(0);
          }

          if (!breakpoint.lg) {
            setCollapsed(true);
          }

          push(key as string);
        }}
      >
        {menuItems.map(({ icon, label, route }) => {
          const isSelected = route === selectedKey;
          return (
            <Menu.Item
              style={{
                fontWeight: isSelected ? "bold" : "normal",
              }}
              key={route}
              icon={icon}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  {label}
                  {label === "Posts" && (
                    <Badge
                      size="small"
                      count={subscriptionCount}
                      offset={[2, -15]}
                    />
                  )}
                </div>
                {!collapsed && isSelected && <Icons.RightOutlined />}
              </div>
            </Menu.Item>
          );
        })}
        <Menu.Item key="logout" icon={<Icons.LogoutOutlined />}>
          Logout
        </Menu.Item>
      </Menu>
    </AntdLayout.Sider>
  );
};
