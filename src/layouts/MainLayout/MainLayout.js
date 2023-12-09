import React, { useEffect, useState } from "react";
import styles from "./MainLayout.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from 'antd';
import { BsBoxArrowLeft  } from "react-icons/bs";

const MainLayout = (props) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const { currentDate } = useCurrentDate();

  const renderIcon = (icon) => {
    let ComponentIcon = icon;
    return <ComponentIcon 
    style={{
      marginRight: 5, 
      verticalAlign: 'bottom',
      fontSize: 22}} />
  }

  return (
    <div className={styles.parent}>
      <div className={`${styles.child} ${styles.header}`}>
          <Button className={styles.datetime} size="large">{currentDate}</Button>
        <div className={styles.user}>
          <div>
            <Button size="large" type="primary" className={styles.descUser}>
              {localStorage.getItem("role") === "vet"
                ? `${localStorage.getItem("specialized")}`
                : "Nhân viên phòng khám"}
            </Button>
            <Button size="large" className={styles.descUser}>
              {localStorage.getItem("role") === "vet"
                ? `Bác sĩ ${localStorage.getItem("name")}`
                : "Nhân viên phòng khám"}
            </Button>
          </div>
          <img
            className={styles.containerImage}
            src={localStorage.getItem("role") === "vet" ? localStorage.getItem("image") : "https://cdn3.vectorstock.com/i/thumb-large/54/37/female-avatar-icon-flat-vector-18115437.jpg"}
            alt="avatar"
          />
        </div>
      </div>
      <div className={styles.main}>
        <div className={`${styles.child} ${styles.sidebar}`}>
          <div className={styles.tabContainer}>
            {props.listTabs.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className={`${styles.tabService} ${tab === item.id ? styles.active : ""
                  }`}
                onClick={() => setTab(item.id)}
              >
                {renderIcon(item.icon)} {item.name}
              </NavLink>
            ))}
          </div>
          <div className={styles.bottomSidebar}>
            <div className={styles.logOutTab} onClick={() => navigate(`/`)}>
              
              <div className={styles.iconLogOut}> <BsBoxArrowLeft 
                size={30}
              /></div>
              <div>Đăng xuất</div>
            </div>
          </div>
        </div>
        <div className={styles.content}>{props.children}</div>
      </div>
        <span className={styles.logoText}>
          Bird<span className={styles.blackText}>Clinic</span>
        </span>
    </div>
  );
};

export default MainLayout;
