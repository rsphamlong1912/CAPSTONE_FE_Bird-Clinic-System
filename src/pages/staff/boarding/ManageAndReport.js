import React, { useEffect, useState } from "react";
import styles from "./ManageAndReport.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import { message } from "antd";
const ManageAndReport = () => {
  const cageApi = Array(20).fill(null);
  const [totalCages, setTotalCages] = useState(cageApi);
  const navigate = useNavigate();

  const [cageList, setCageList] = useState([]);
  useEffect(() => {
    const sendApiforData = async () => {
      try {
        const response = await api.get(`/cage/`);
        console.log("response:", response);

        setCageList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    sendApiforData();
  }, []);

  const filledCageList = [
    ...cageList,
    ...Array(20 - cageList.length).fill({ id: null, name: "Default Cage" }),
  ];
  const handleCageClick = (cage) => {
    if (cage.bird_id) {
      navigate(`/manage-report/${cage.id || "default"}`);
    } else {
      message.error("Lồng trống");
    }
  };

  const [selectedSize, setSelectedSize] = useState("");
  const filteredCageList = filledCageList.filter((cage) => {
    if (selectedSize === "") {
      return true;
    } else {
      // Thay thế điều kiện dưới đây bằng điều kiện phù hợp với dữ liệu của bạn
      return cage.size === selectedSize;
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.left}>QUẢN LÝ LỒNG</div>
        <div className={styles.center}>
          <select
            className={styles.selectCenter}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="SZ001">Rất nhỏ</option>
            <option value="SZ002">Nhỏ</option>
            <option value="SZ003">Vừa</option>
            <option value="SZ004">Lớn</option>
          </select>
        </div>
        <div className={styles.right}>
          <div className={styles.btnSearch}>
            <SearchOutlined />
          </div>
          <input type="text" placeholder="Tìm kiếm" name="search" />
        </div>
      </div>
      <div className={styles.cageChosen}>
        {filteredCageList.map((cage, index) => (
          <div
            key={cage.id || index}
            className={`${styles.cageItem} ${
              cage.bird_id ? styles.active : styles.inactive
            }`}
            onClick={() => handleCageClick(cage)}
          >
            <p>{`L.${cage.id || index + 1}`}</p>
            <span>{`${
              cage.bird_id ? cage.bird_id.slice(0, 6) + "..." : ""
            }`}</span>
          </div>
        ))}
      </div>
      <div
        className={styles.footerContent}
      >{`${cageList.length}/20 sức chứa`}</div>
    </div>
  );
};

export default ManageAndReport;
