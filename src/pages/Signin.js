import React, { useState } from "react";
import styles from "./Signin.module.scss";
import { api } from "../services/axios";
import { toast } from "react-toastify";

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
        console.log("Đăng nhập thành công:", response.data.data);
        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        const { account_id, name, service_id } = response.data.data.data;
        localStorage.setItem("account_id", account_id);
        localStorage.setItem("name", name);
        localStorage.setItem("role", response.data.data.role);
        const role = response.data.data.role;
        console.log(role);
        if (role === "vet") {
          if (service_id === "S001") {
            window.location.href = "/examing";
          } else if (service_id === "S013") {
            window.location.href = "/boarding";
          } else if (service_id === "S009") {
            window.location.href = "/grooming";
          } else {
            window.location.href = "/retesting";
          }
        } else if (role === "staff") {
          window.location.href = "/track";
        }
      })
      .catch((error) => {
        // Xử lý lỗi khi đăng nhập không thành công
        console.error("Đăng nhập không thành công:", error);
        setError("Đăng nhập không thành công");
        toast.error("Đăng nhập thất bại!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
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
