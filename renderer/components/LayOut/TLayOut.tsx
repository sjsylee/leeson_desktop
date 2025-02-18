import React, { useState } from "react";
import {
  PlusSquareOutlined,
  SettingOutlined,
  CalculatorOutlined,
  ProfileOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { useRouter } from "next/router";
const { Header, Content, Footer, Sider } = Layout;
import { motion } from "framer-motion";

type MenuItem = Required<MenuProps>["items"][number];

interface LCProps {
  children: React.ReactNode;
}

const App: React.FC<LCProps> = ({ children }) => {
  const router = useRouter();

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>(
    router.pathname.replace("/", "") || "home"
  );

  const getAnimatedIcon = (
    key: string,
    d: string,
    color1: string,
    color2: string
  ) => (
    <motion.div
      animate={{
        scale: selectedKey === key || hoveredKey === key ? 1.3 : 1, // 선택되었거나 호버 중이면 확대
      }}
      transition={{ duration: selectedKey === key ? 0 : 0.2 }} // 라우터 이동 시 즉시 확대
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        <motion.path
          d={d}
          stroke="#EEE" // 테두리 색 유지
          strokeWidth="1.5"
          fill="transparent"
          animate={{
            fill:
              hoveredKey === key || selectedKey === key
                ? `url(#gradient-${key})`
                : "transparent", // 선택/호버 시 그라디언트 적용
          }}
          transition={{
            duration: hoveredKey === key ? 0.3 : 0.4, // 색 채울 때 0.3초, 빠질 때 0.4초로 더 부드럽게
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );

  const items: MenuItem[] = [
    {
      key: "opt",
      label: "설정",
      icon: getAnimatedIcon(
        "opt",
        "M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z",
        "#A9BFA8",
        "#5E686D"
      ),
      onMouseEnter: () => setHoveredKey("opt"),
      onMouseLeave: () => setHoveredKey(null),
      onClick: () => setSelectedKey("opt"),
    },

    {
      key: "grp1",
      label: "추가",
      type: "group",
      children: [
        {
          key: "home",
          label: "카테고리 추가",
          icon: getAnimatedIcon(
            "home",
            "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z",
            "#FFD65A",
            "#E82561"
          ),
          onMouseEnter: () => setHoveredKey("home"),
          onMouseLeave: () => setHoveredKey(null),
          onClick: () => setSelectedKey("home"),
        },
        {
          key: "kwd",
          label: "키워드 추가",
          icon: getAnimatedIcon(
            "kwd",
            "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z",
            "#85A947",
            "#3E7B27"
          ),
          onMouseEnter: () => setHoveredKey("kwd"),
          onMouseLeave: () => setHoveredKey(null),
          onClick: () => setSelectedKey("kwd"),
        },
      ],
    },
    {
      key: "grp2",
      label: "확인",
      type: "group",
      children: [
        {
          key: "hsCode",
          label: "HS CODE",
          icon: getAnimatedIcon(
            "hsCode",
            "M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z",
            "#72BAA9",
            "#474E93"
          ),
          onMouseEnter: () => setHoveredKey("hsCode"),
          onMouseLeave: () => setHoveredKey(null),
          onClick: () => setSelectedKey("hsCode"),
        },

        {
          key: "cpCat",
          label: "쿠팡 카테고리",
          icon: getAnimatedIcon(
            "cpCat",
            "M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z",
            "#FFF574",
            "#FB4141"
          ),
          onMouseEnter: () => setHoveredKey("cpCat"),
          onMouseLeave: () => setHoveredKey(null),
          onClick: () => setSelectedKey("cpCat"),
        },
        // {
        //   key: "textTest",
        //   label: "글자수 세기",
        //   icon: getAnimatedIcon(
        //     "textTest",
        //     <PlusSquareOutlined style={{ color: "#EEE", fontSize: "14px" }} />
        //   ),
        //   onMouseEnter: () => setHoveredKey("textTest"),
        //   onMouseLeave: () => setHoveredKey(null),
        //   onClick: () => setSelectedKey("textTest"),
        // },
      ],
    },
    // getItem("설정", "opt", <SettingOutlined />),
    // getItem("카테고리 추가", "home", <PlusSquareOutlined />),
    // getItem("키워드 추가", "kwd", <PlusSquareOutlined />),
    // getItem("HS CODE", "hsCode", <ProfileOutlined />),
    // getItem("글자수 세기", "textTest", <CalculatorOutlined />),
    // getItem("쿠팡 카테고리", "cpCat", <ZoomInOutlined />),
    ,
  ];

  return (
    <Layout className="custom-layout">
      <Layout style={{ minHeight: "100vh" }} className="custom-sider-layout">
        <Sider
          className="custom-sider"
          width={"250px"}
          style={{
            background: "#EEEEEE",
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="titlebar" style={{ padding: 20, height: "200px" }} />
          <Menu
            className="custom-menu"
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            selectedKeys={[router.pathname.replace("/", "")]}
            onClick={({ key }) => {
              router.replace(key);
            }}
            style={{
              background: "#EEEEEE",
            }}
            items={items}
          />
        </Sider>
        <Layout
          style={{ marginLeft: "250px" }}
          className="custom-content-layout"
        >
          <Header
            className="custom-header"
            style={{ padding: 0, height: 20 }}
          />
          <Content
            className="custom-content"
            style={{
              padding: 24,
              minHeight: 420,
              marginTop: "20px",
            }}
          >
            {children}
          </Content>
          <Footer
            className="custom-footer"
            style={{
              textAlign: "center",
              fontSize: 10,
              color: "#EEE",
            }}
          >
            Created by SJ LEE
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
