import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  message,
  Card,
  Divider,
  Input,
  Button,
  Table,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  SearchOutlined,
  RedoOutlined,
  WarningTwoTone,
  TableOutlined,
} from "@ant-design/icons";
import { fetchJson } from "../lib/api";

const { Title, Text } = Typography;
const { Search } = Input;

interface DataType {
  attributeTypeName: string;
  dataType: string;
  inputType: string[];
  basicUnit: string;
  usableUnits: string[];
  required: string;
  groupNumber: string;
  exposed: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "옵션명",
    dataIndex: "attributeTypeName",
    key: "attributeTypeName",
    width: "100px",
    render: (text) => <Text style={{ fontSize: "18px" }}>{text}</Text>,
  },

  {
    title: "기본 단위",
    dataIndex: "basicUnit",
    key: "basicUnit",
    width: "100px",
    render: (text) => (
      <Text
        style={{
          fontSize: text === "없음" ? "15px" : "18px",
          color: text === "없음" ? "#D91656" : "#001F3F",
        }}
      >
        {text}
      </Text>
    ),
  },
  {
    title: "사용 가능 단위",
    dataIndex: "usableUnits",
    key: "usableUnits",
    width: "100px",
    render: (array) => (
      <Text style={{ fontSize: "15px" }}>{array.join(", ")}</Text>
    ),
  },
  {
    title: "데이터 타입",
    dataIndex: "dataType",
    key: "dataType",
    width: "100px",
    render: (text) => (
      <Text style={{ fontSize: "18px", color: "#347928" }}>{text}</Text>
    ),
  },
];

export default function NextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<any[]>([]);
  const [value, setValue] = useState<number | string>();
  const [accessKey, setAccessKey] = useState<string | null | undefined>();
  const [secretKey, setSecretKey] = useState<string | null | undefined>();
  const [networkOpt, setNetworkOpt] = useState<"in" | "out">();
  const [catTitle, setCatTitle] = useState<string>();
  const [config, setConfig] = useState();

  useEffect(() => {
    const no = localStorage.getItem("networkOpt");
    setNetworkOpt(no as any);

    const ak = localStorage.getItem("accessKey");
    setAccessKey(ak);

    (window as any).electron.ipcRenderer.invoke("get-config").then((c) => {
      localStorage.setItem("config", JSON.stringify(c));
      setConfig(c);

      if (Object.values(c).includes(null)) {
        messageApi.error({
          content: `CONFIG 설정이 끝나지 않았습니다!`,
          style: { color: "#B82132", fontSize: "18px" },
          icon: <WarningTwoTone twoToneColor="#BE3144" />,
          duration: null,
        });
      }
    });
  }, []);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {contextHolder}
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={36} sm={36} md={24} lg={24} xl={26} className="mb-24">
            <Card bordered={false} style={{ minHeight: "500px" }}>
              <Row>
                <Col>
                  <Title level={4}>쿠팡 카테고리 검색</Title>
                </Col>
              </Row>
              <Divider />

              <Row
                align="middle"
                style={{ marginBottom: "10px", marginTop: "28px" }}
              >
                <Col style={{ marginRight: "5px" }}>
                  <SearchOutlined />
                </Col>
                <Col>
                  <Text style={{ fontSize: "14px" }}>쿠팡 카테고리 검색</Text>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col>
                  <Search
                    loading={isLoading}
                    enterButton={
                      <Button
                        size="large"
                        type="primary"
                        icon={<SearchOutlined />}
                        loading={isLoading}
                      ></Button>
                    }
                    size="large"
                    value={value}
                    placeholder="쿠팡 카테고리 번호를 입력해주세요."
                    style={{ width: "300px" }}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    onSearch={async () => {
                      if (!value) {
                        messageApi.error({
                          content: "카테고리 번호를 입력해주세요!",
                          icon: <WarningTwoTone twoToneColor="#C70039" />,
                        });
                        return;
                      }

                      if (!accessKey || !secretKey) {
                        messageApi.error({
                          content: "쿠팡 API KEY 값을 입력해주세요!",
                          icon: <WarningTwoTone twoToneColor="#C70039" />,
                        });
                        return;
                      }

                      setIsLoading(true);

                      const r = await fetchJson("/api/searchCPCatMeta", {
                        method: "POST",
                        body: JSON.stringify({
                          catCode: value,
                          accessKey: accessKey,
                          secretKey: secretKey,
                          networkOpt: networkOpt,
                        }),
                      });

                      if (r.status === 400) {
                        messageApi.error({
                          content: "존재하지 않는 카테고리 입니다!",
                          icon: <WarningTwoTone twoToneColor="#C70039" />,
                        });
                      } else if (r.status === 401) {
                        messageApi.error({
                          content: "올바르지 않은 API KEY 입니다!",
                          icon: <WarningTwoTone twoToneColor="#C70039" />,
                        });
                      } else {
                        setData(r.result);
                        setCatTitle(r.cat_title);
                      }

                      setIsLoading(false);
                    }}
                  />
                </Col>
                <Col>
                  <Button
                    size="large"
                    type="primary"
                    icon={<RedoOutlined />}
                    onClick={() => {
                      setValue(null);
                      setCatTitle(null);
                      setData([]);
                    }}
                  >
                    초기화
                  </Button>
                </Col>
              </Row>
              <Row
                align="middle"
                style={{ marginBottom: "10px", marginTop: "28px" }}
              >
                <Col style={{ marginRight: "5px" }}>
                  <TableOutlined />
                </Col>
                <Col>
                  <Text style={{ fontSize: "14px" }}>필수 입력 옵션</Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: "15px" }}>
                <Col>
                  <Input
                    style={{ width: "600px" }}
                    size="large"
                    value={catTitle}
                    readOnly
                  />
                </Col>
              </Row>

              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                loading={isLoading}
              />

              <Row
                align="middle"
                style={{ marginBottom: "10px", marginTop: "40px" }}
              ></Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
