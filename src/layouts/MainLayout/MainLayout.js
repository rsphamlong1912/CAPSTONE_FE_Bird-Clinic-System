import React, { useEffect, useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import "./MainLayout.scss";
import useCurrentDate from "../../hooks/useCurrentDate";
import { NavLink } from "react-router-dom";

const MainLayout = (props) => {
  const [tab, setTab] = useState(1);
  const { currentDate } = useCurrentDate();
  return (
    <div class="parent">
      <div class="child header">
        <span className="logo-text">
          Bird<span className="black-text">Clinic</span>
        </span>
        <div className="datetime">{currentDate}</div>
        <div className="user">
          <span>Staff Nguyễn Lê Hữu</span>
          <img
            src="https://kynguyenlamdep.com/wp-content/uploads/2022/06/avatar-cute-meo-con-than-chet-700x695.jpg"
            alt="avatar"
          />
        </div>
      </div>
      <div class="main">
        <div class="child sidebar">
          <div className="tab-container">
            {props.listTabs.map((item) => (
              <NavLink
                to={item.to}
                className={`tab-service ${tab === item.id ? "active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="bottom-sidebar">
            <div className="tab-service" onClick={() => {}}>
              <LogoutOutlined
                style={{ fontSize: "20px", marginRight: "5px" }}
              />
              Đăng xuất
            </div>
          </div>
        </div>
        <div class="content">{props.children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
