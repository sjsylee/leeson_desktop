import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  message,
  Card,
  Select,
  Divider,
  Input,
  Button,
  Radio,
  Popconfirm,
} from "antd";
import type { SelectProps } from "antd";
import {
  SearchOutlined,
  AmazonOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  CheckCircleTwoTone,
  WarningTwoTone,
  ControlOutlined,
  CloudDownloadOutlined,
  RedoOutlined,
  CopyOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { fetchJson } from "../lib/api";
import qs from "qs";
import { CopyToClipboard } from "react-copy-to-clipboard";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const { Title, Text } = Typography;

export default function NextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<SelectProps["options"]>([]);
  const [value, setValue] = useState<number>();
  const [uploadValue, setUploadValue] = useState<string>();
  const [searchOpt, setSearchOpt] = useState<"cp" | "ec">("cp");
  const [savePath, setSavePath] = useState<string>();
  const [config, setConfig] = useState();
  const [networkOpt, setNetworkOpt] = useState<"in" | "out">("in");
  const [selHeight, setSelHeight] = useState<number>();

  const fetch = (
    value: string,
    searchOpt: string,
    networkOpt: string,
    callback: (data: { value: string; text: string }[]) => void
  ) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    const fake = () => {
      const str = qs.stringify({
        q: value,
        networkOpt: networkOpt,
      });
      fetchJson(`api/searchCat${searchOpt.toUpperCase()}?${str}`, {
        body: JSON.stringify({
          config: config,
        }),
      }).then((d: any) => {
        if (currentValue === value) {
          const { result } = d;
          callback(result);
        }
      });
    };
    if (value && value.length > 1) {
      timeout = setTimeout(fake, 300);
    } else {
      callback([]);
    }
  };

  useEffect(() => {
    const p = localStorage.getItem("savePath");
    setSavePath(p);

    const no = localStorage.getItem("networkOpt");
    setNetworkOpt(no as any);

    const sh = localStorage.getItem("selHeight");
    setSelHeight(Number(sh) as any);

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

  const handleSearch = (newValue: string) => {
    fetch(newValue, searchOpt, networkOpt, setData as any);
    (window as any).electron.ipcRenderer.send("expand-window", {
      width: 1400,
      height: 1400,
    });
  };

  const handleChange = (newValue: number) => {
    setValue(newValue);
    (window as any).electron.ipcRenderer.send("restore-window");
  };

  return (
    <>
      {contextHolder}
      <div>
        <Row gutter={8} align={"middle"}>
          <Col>
            <FormOutlined
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
              카테고리 추가
            </Text>
          </Col>
        </Row>
        <Divider />
        <Row align="middle" style={{ marginBottom: "20px" }}>
          <Col style={{ marginRight: "5px" }}>
            <ControlOutlined style={{ fontSize: "16px", color: "#EEE" }} />
          </Col>
          <Col>
            <Text style={{ fontSize: "16px", color: "#EEE" }}>
              검색 옵션 선택
            </Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Radio.Group
              size="large"
              value={searchOpt}
              onChange={(e) => {
                setValue(null);
                setData([]);
                setSearchOpt(e.target.value);
              }}
              buttonStyle="solid"
            >
              <Radio.Button value="cp">쿠팡 카테고리</Radio.Button>
              <Radio.Button value="ec">기존 카테고리</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>

        <Row align="middle" style={{ marginBottom: "20px", marginTop: "34px" }}>
          <Col style={{ marginRight: "5px" }}>
            <AmazonOutlined style={{ fontSize: "16px", color: "#EEE" }} />
          </Col>
          <Col>
            <Text style={{ fontSize: "16px", color: "#EEE" }}>
              Amazon 카테고리 매칭
            </Text>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col>
            <Input
              style={{ width: "120px" }}
              size="large"
              value={value}
              readOnly
            />
          </Col>
          <Col>
            <Input
              style={{ minWidth: "800px" }}
              size="large"
              placeholder="Amazon 카테고리를 입력해주세요."
              value={uploadValue}
              onChange={(nv) => {
                setUploadValue(nv.target.value);
              }}
              allowClear
            />
          </Col>
        </Row>
        {searchOpt === "cp" && (
          <>
            <Row
              align="middle"
              style={{ marginBottom: "20px", marginTop: "34px" }}
            >
              <Col style={{ marginRight: "5px" }}>
                <SearchOutlined style={{ fontSize: "16px", color: "#EEE" }} />
              </Col>
              <Col>
                <Text style={{ fontSize: "16px", color: "#EEE" }}>
                  쿠팡 카테고리 검색
                </Text>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col>
                <Select
                  allowClear
                  style={{ minWidth: "700px" }}
                  size="large"
                  showSearch
                  placeholder="쿠팡 카테고리를 검색해주세요."
                  defaultActiveFirstOption={false}
                  suffixIcon={null}
                  filterOption={false}
                  notFoundContent={null}
                  onSearch={handleSearch}
                  onChange={handleChange}
                  value={value}
                  options={data}
                  listHeight={selHeight}
                />
              </Col>
              <Col>
                <CopyToClipboard
                  text={
                    data.length > 0 &&
                    data.filter((d) => d.value == value).length > 0
                      ? data.filter((d) => d.value == value)[0]["label"]
                      : null
                  }
                  onCopy={() => {
                    messageApi.success({
                      content: `복사 성공!`,
                      style: { color: "#EEE" },
                      icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                    });
                  }}
                >
                  <Button
                    style={{ color: "#000" }}
                    size="large"
                    type="primary"
                    icon={<CopyOutlined />}
                  >
                    복사
                  </Button>
                </CopyToClipboard>
              </Col>
              <Col>
                <Button
                  size="large"
                  type="primary"
                  style={{ color: "#000" }}
                  icon={<RedoOutlined />}
                  onClick={() => {
                    setValue(null);
                    setUploadValue(null);
                  }}
                >
                  초기화
                </Button>
              </Col>
            </Row>
          </>
        )}
        {searchOpt === "ec" && (
          <>
            <Row
              align="middle"
              style={{ marginBottom: "20px", marginTop: "34px" }}
            >
              <Col style={{ marginRight: "5px" }}>
                <SearchOutlined style={{ fontSize: "16px", color: "#EEE" }} />
              </Col>
              <Col>
                <Text style={{ fontSize: "16px", color: "#EEE" }}>
                  기존 카테고리 검색
                </Text>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col>
                <Select
                  style={{ minWidth: "700px" }}
                  size="large"
                  showSearch
                  placeholder="기존 카테고리를 영어로 검색해주세요."
                  defaultActiveFirstOption={false}
                  suffixIcon={null}
                  filterOption={false}
                  notFoundContent={null}
                  onSearch={handleSearch}
                  onChange={handleChange}
                  value={value}
                  options={data}
                  listHeight={selHeight}
                  allowClear
                />
              </Col>
              <Col>
                <CopyToClipboard
                  text={
                    data.length > 0 &&
                    data.filter((d) => d.value == value).length > 0
                      ? data.filter((d) => d.value == value)[0]["label"]
                      : null
                  }
                  onCopy={() => {
                    messageApi.success({
                      content: `복사 성공!`,
                      icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                    });
                  }}
                >
                  <Button
                    style={{ color: "#000" }}
                    size="large"
                    type="primary"
                    icon={<CopyOutlined />}
                  >
                    복사
                  </Button>
                </CopyToClipboard>
              </Col>
              <Col>
                <Button
                  style={{ color: "#000" }}
                  size="large"
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={() => {
                    setValue(null);
                    setUploadValue(null);
                  }}
                >
                  초기화
                </Button>
              </Col>
            </Row>
          </>
        )}
        <Row align="middle" style={{ marginBottom: "10px", marginTop: "60px" }}>
          <Col style={{ marginRight: "5px" }}>
            <CloudUploadOutlined style={{ fontSize: "16px", color: "#EEE" }} />
          </Col>
          <Col>
            <Text style={{ fontSize: "16px", color: "#EEE" }}>
              카테고리 업로드
            </Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              size="large"
              type="primary"
              icon={<DatabaseOutlined />}
              disabled={!value || !uploadValue}
              style={
                !value || !uploadValue ? { color: "#EEE" } : { color: "#000" }
              }
              loading={isLoading}
              onClick={async () => {
                setIsLoading(true);

                const r = await fetchJson("/api/uploadCat", {
                  method: "POST",
                  body: JSON.stringify({
                    name: uploadValue,
                    displayCategoryCode: value,
                    networkOpt: networkOpt,
                    config: config,
                  }),
                });

                if (!r.result) {
                  if (r.errorLog.includes("Duplicate")) {
                    messageApi.error({
                      content: "중복되는 카테고리 값이 존재합니다!",
                      icon: <WarningTwoTone twoToneColor="#C70039" />,
                    });
                  } else {
                    messageApi.error({
                      content: "에러 발생! 문의요망",
                      icon: <WarningTwoTone twoToneColor="#C70039" />,
                    });
                  }
                } else {
                  messageApi.success({
                    content: `카테고리 업로드 성공!`,
                    icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                  });
                }

                console.log(r);

                setIsLoading(false);
              }}
            >
              DB 업로드
            </Button>
          </Col>
        </Row>
        <Row align="middle" style={{ marginBottom: "20px", marginTop: "34px" }}>
          <Col style={{ marginRight: "5px" }}>
            <CloudDownloadOutlined
              style={{ fontSize: "16px", color: "#EEE" }}
            />
          </Col>
          <Col>
            <Text style={{ fontSize: "16px", color: "#EEE" }}>
              카테고리 다운로드
            </Text>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col>
            <Input
              size="large"
              value={savePath}
              status="warning"
              style={{ minWidth: "700px" }}
              placeholder="저장경로를 입력해주세요."
              onChange={(e) => {
                const cv = e.target.value;

                setSavePath(cv);
                localStorage.setItem("savePath", cv);
              }}
            />
          </Col>
          <Col>
            <Popconfirm
              title="카테고리 다운로드"
              description="최신화된 카테고리를 다운로드 하시겠습니까?"
              okText="다운로드"
              cancelText="종료"
              onConfirm={async () => {
                setIsLoading(true);

                const r = await fetchJson("/api/downloadCat", {
                  method: "POST",
                  body: JSON.stringify({
                    savePath: savePath,
                    networkOpt: networkOpt,
                    config: config,
                  }),
                });

                if (!r.result) {
                  if (r.errorLog.includes("Unrecognized")) {
                    messageApi.error({
                      content: "엑셀 파일 확장자가 올바르지 않습니다!",
                      icon: <WarningTwoTone twoToneColor="#C70039" />,
                    });
                  } else {
                    messageApi.error({
                      content: "존재하지 않는 파일 경로 입니다!",
                      icon: <WarningTwoTone twoToneColor="#C70039" />,
                    });
                  }
                } else {
                  messageApi.success({
                    content: `카테고리 다운로드 성공!`,
                    icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                  });
                }

                setIsLoading(false);
              }}
            >
              <Button
                type="primary"
                size="large"
                icon={<CloudDownloadOutlined />}
                style={{ color: "#000" }}
              >
                다운로드
              </Button>
            </Popconfirm>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{ marginBottom: "10px", marginTop: "40px" }}
        ></Row>
      </div>
    </>
  );
}
