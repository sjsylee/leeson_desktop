import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  message,
  Divider,
  InputNumber,
  Button,
  Badge,
} from "antd";
import {
  ApiOutlined,
  ColumnHeightOutlined,
  SettingOutlined,
  ExclamationCircleFilled,
  ToolOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function NextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selHeight, setSelHeight] = useState<number>();
  const [config, setConfig] = useState();

  useEffect(() => {
    const sh = localStorage.getItem("selHeight");
    setSelHeight(Number(sh) as any);

    (window as any).electron.ipcRenderer.invoke("get-config").then((c) => {
      localStorage.setItem("config", JSON.stringify(c));
      setConfig(c);
    });
  }, []);

  return (
    <>
      {contextHolder}
      <div>
        <Row gutter={8} align={"middle"}>
          <Col>
            <SettingOutlined
              style={{
                fontSize: "20px",
                color: "#EEE",
              }}
            />
          </Col>
          <Col>
            <Text
              style={{
                fontFamily: "LINESeedKR-Bd",
                fontSize: "20px",
                color: "#EEE",
              }}
            >
              설정
            </Text>
          </Col>
        </Row>
        <Divider />
        <Row align="middle" style={{ marginBottom: "20px" }}>
          <Col style={{ marginRight: "5px" }}>
            <ApiOutlined style={{ fontSize: "16px", color: "#EEE" }} />
          </Col>
          <Col>
            <Text style={{ fontSize: "16px", color: "#EEE" }}>CONFIG 설정</Text>
          </Col>
        </Row>
        <Row>
          <Col>
            {config && Object.values(config).includes(null) ? (
              <Badge
                size="default"
                dot
                count={
                  <ExclamationCircleFilled
                    style={{ color: "#EB5A3C", fontSize: "20px" }}
                  />
                }
              >
                <Button
                  size="large"
                  type="primary"
                  style={{ color: "#000" }}
                  icon={<ToolOutlined />}
                >
                  CONFIG
                </Button>
              </Badge>
            ) : (
              <Button
                size="large"
                type="primary"
                style={{ color: "#000" }}
                icon={<ToolOutlined />}
              >
                CONFIG
              </Button>
            )}
          </Col>
        </Row>

        <Row align="middle" style={{ marginBottom: "20px", marginTop: "34px" }}>
          <Col style={{ marginRight: "5px" }}>
            <ColumnHeightOutlined style={{ fontSize: "16px", color: "#EEE" }} />
          </Col>
          <Col>
            <Text style={{ fontSize: "16px", color: "#EEE" }}>
              SELECT 높이 설정
            </Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Text style={{ color: "#15B392" }}>
              💡 옵션 한줄당 32px 입니다.
            </Text>
          </Col>
        </Row>
        <Row style={{ marginTop: "5px" }}>
          <Col>
            <InputNumber
              size="large"
              style={{ width: "100px" }}
              value={selHeight}
              onChange={(value) => {
                setSelHeight(value);
                localStorage.setItem(
                  "selHeight",
                  value ? value.toString() : "100"
                );
              }}
              min={100}
              suffix={"px"}
            />
          </Col>
        </Row>
        {/* <Row align="middle" style={{ marginBottom: "10px", marginTop: "28px" }}>
          <Col style={{ marginRight: "5px" }}>
            <ApiOutlined />{" "}
          </Col>
          <Col>
            <Text style={{ fontSize: "14px" }}>쿠팡 API KEY 설정</Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Text style={{ color: "#091057" }}>🔑 Access Key</Text>
          </Col>
        </Row>
        <Row style={{ marginTop: "5px" }}>
          <Col>
            <Input
              allowClear
              placeholder="Access Key를 입력해주세요."
              size="large"
              style={{ width: "400px" }}
              value={accessKey}
              onChange={(e) => {
                setAccessKey(e.target.value);
                localStorage.setItem("accessKey", e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }}>
          <Col>
            <Text style={{ color: "#347928" }}>🔑 Secret Key</Text>
          </Col>
        </Row>
        <Row style={{ marginTop: "5px" }}>
          <Col>
            <Input
              allowClear
              placeholder="Secret Key를 입력해주세요."
              size="large"
              style={{ width: "400px" }}
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                localStorage.setItem("secretKey", e.target.value);
              }}
            />
          </Col>
        </Row> */}
        <Row
          align="middle"
          style={{ marginBottom: "10px", marginTop: "40px" }}
        ></Row>
      </div>
    </>
  );
}
