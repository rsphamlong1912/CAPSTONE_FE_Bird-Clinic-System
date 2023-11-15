import React, { useEffect, useState } from "react";
import styles from "./ManageAndReport.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import { message } from "antd";
const ManageAndReport = () => {
  const [cageList, setCageList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const sendApiForData = async () => {
      try {
        const response = await api.get(`/cage/`);
        console.log("response:", response);
        setCageList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    sendApiForData();
  }, []);

  const handleCageClick = (cage) => {
    if (cage.bird_id) {
      navigate(`/manage-report/${cage.id || "default"}`);
    } else {
      message.error("Lồng trống");
    }
  };

  const [selectedSize, setSelectedSize] = useState("");
  const filteredCageList = cageList.filter((cage) => {
    if (selectedSize === "") {
      return true;
    } else {
      // Adjust this condition based on your data structure
      return cage.size === selectedSize;
    }
  });

  const activeCagesCount = filteredCageList.filter(
    (cage) => cage.status === "not_empty"
  ).length;
  const cagesCount = filteredCageList.filter((cage) => cage.cage_id).length;

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
              cage.status === "not_empty" ? styles.active : styles.inactive
            }`}
            onClick={() => handleCageClick(cage)}
          >
            <p>{`L.${cage.cage_id}`}</p>
            <span>{`${
              cage.bird_id ? cage.bird_id.slice(0, 6) + "..." : "Empty Slot"
            }`}</span>
          </div>
        ))}
      </div>
      <div
        className={styles.footerContent}
      >{`${activeCagesCount}/${cagesCount} sức chứa`}</div>
    </div>
  );
};

export default ManageAndReport;
