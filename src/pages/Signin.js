import React, { useState } from "react";
import styles from "./Signin.module.scss";
import { api } from "../services/axios";

const Signin = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // const handleRegisterClick = () => {
  //   setIsActive(true);
  // };

  const handleLogin = (e) => {
    //ngăn reload trang
    e.preventDefault();

    // Gửi yêu cầu đăng nhập đến API sử dụng Axios
    api
      .post(`/login/?phone=${phone}&password=${password}`)
      .then((response) => {
        // Xử lý phản hồi từ API khi đăng nhập thành công
        console.log("Đăng nhập thành công:", response.data);
        console.log(response.data.data);
        const { account_id } = response.data.data.account;
        localStorage.setItem("account_id", account_id);
        const role = response.data.data.role;
        if (role === "vet") {
          window.location.href = "/examing";
        } else if (role === "staff") {
          window.location.href = "/track";
        }
      })
      .catch((error) => {
        // Xử lý lỗi khi đăng nhập không thành công
        console.error("Đăng nhập không thành công:", error);
        setError("Đăng nhập không thành công");
      });
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.container} id="container">
        <div className={`${styles.formContainer} ${styles.signin}`}>
          <form>
            <h2>Đăng nhập</h2>
            <input
              type="text"
              name="phone"
              value={phone}
              placeholder="Số điện thoại"
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="">Quên mật khẩu</a>
            <button type="button" onClick={handleLogin}>
              Đăng nhập
            </button>
          </form>
        </div>
        <div className={styles.toggleContainer}>
          <div className={styles.toggle}>
            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
              <h2>Xin chào</h2>
              <img src={require("../assets/ve.png")} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
