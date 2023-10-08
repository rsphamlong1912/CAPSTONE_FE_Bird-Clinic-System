import React, { useState } from "react";
import styles from "./styles/Signin.module.scss";
const Signin = () => {
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };
  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.container} ${isActive ? "active" : ""}`}
        id="container"
      >
        <div className={`${styles.formContainer} ${styles.signin}`}>
          <form>
            <h2>Đăng nhập</h2>
            <input type="text" name="" id="" placeholder="Email" />
            <input type="password" name="" id="" placeholder="Password" />
            <a href="">Quên mật khẩu</a>
            <button>Đăng nhập</button>
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
