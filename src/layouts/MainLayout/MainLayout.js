import React, { useEffect, useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import styles from "./MainLayout.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";
import { NavLink } from "react-router-dom";

const MainLayout = (props) => {
  const [tab, setTab] = useState(1);
  const { currentDate } = useCurrentDate();
  return (
    <div className={styles.parent}>
      <div className={`${styles.child} ${styles.header}`}>
        <span className={styles.logoText}>
          Bird<span className={styles.blackText}>Clinic</span>
        </span>
        <div className={styles.datetime}>{currentDate}</div>
        <div className={styles.user}>
          <span>Staff Nguyễn Lê Hữu</span>
          <img
            src="https://kynguyenlamdep.com/wp-content/uploads/2022/06/avatar-cute-meo-con-than-chet-700x695.jpg"
            alt="avatar"
          />
        </div>
      </div>
      <div className={styles.main}>
        <div class={`${styles.child} ${styles.sidebar}`}>
          <div className={styles.tabContainer}>
            {props.listTabs.map((item) => (
              <NavLink
                to={item.to}
                className={`${styles.tabService} ${
                  tab === item.id ? styles.active : ""
                }`}
                onClick={() => setTab(item.id)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className={styles.bottomSidebar}>
            <div className="tab-service" onClick={() => {}}>
              <LogoutOutlined
                style={{ fontSize: "20px", marginRight: "5px", color: "white" }}
              />
              Đăng xuất
            </div>
          </div>
        </div>
        <div class={styles.content}>{props.children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
