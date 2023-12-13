import React, { useEffect, useState } from "react";
import styles from "./Report.module.scss";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { MdOutlineDone } from "react-icons/md";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";
import { AiOutlinePrinter } from "react-icons/ai";
import { api } from "../../../services/axios";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
const socket = io("https://clinicsystem.io.vn/");

const Report = () => {
  const { boarding_id } = useParams();
  const [boardingInfo, setBoardingInfo] = useState();
  const [serviceFormList, setServiceFormList] = useState();
  const [serviceFormSelect, setServiceFormSelect] = useState();
  const [serviceFormDetailList, setServiceFormDetailList] = useState();
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [tab, setTab] = useState(1);
  const [chatId, setChatId] = useState();
  const [customerId, setCustomerId] = useState();
  const [chatContent, setContentChat] = useState([]);
  const [message, setMessage] = useState();

  const navigate = useNavigate();

  // Hàm này được sử dụng để thêm một bảng mới vào danh sách
  const createTable = () => {
    const handleChangeType = (event) => {
      setSelectedType(event.target.value); // Cập nhật giá trị đã chọn khi người dùng thay đổi
    };
    // Tạo một bảng mới (có thể là một đối tượng hoặc một mã HTML JSX)
    const newTable = (
      <div className={styles.Services}>
        <div className={styles.ListServices}>
          <select
            className={styles.TypeList}
            value={selectedType}
            onChange={handleChangeType}
          >
            <option value="">--</option>
            <option value="Tỉa lông">Tỉa lông</option>
            <option value="Cắt móng">Cắt móng</option>
            <option value="Cắt cánh">Cắt cánh</option>
          </select>
        </div>
        <div className={styles.iconCheck}>
          <MdOutlineDone />
        </div>
        <div className={styles.unCheck}>X</div>
      </div>
    );

    // Cập nhật danh sách bảng bằng cách thêm bảng mới vào mảng hiện tại
    setTables([...tables, newTable]);
  };
  const getChatContent = async (chatId, customerId) => {
    try {
      const responseChatContent = await api.get(
        `content-chat/?chat_id=${chatId}&user1=clinic&user2=${customerId}`
      );
      setContentChat(responseChatContent.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getBoardingInfo = async () => {
    try {
      const responseBoarding = await api.get(`/boarding/${boarding_id}`);
      if (responseBoarding) {
        setBoardingInfo(responseBoarding.data.data);
        setChatId(responseBoarding.data.data.chats.chat_id);
        setCustomerId(responseBoarding.data.data.chats.customer_id);
        getChatContent(
          responseBoarding.data.data.chats.chat_id,
          responseBoarding.data.data.chats.customer_id
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServiceForm = async () => {
    try {
      const responseServiceForm = await api.get(
        `/service-form/?booking_id=${boarding_id}`
      );
      if (responseServiceForm) {
        console.log("service form list ne: ", responseServiceForm.data.data);
        setServiceFormList(responseServiceForm.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBoardingInfo();
    fetchServiceForm();
  }, []);

  const sendMessage = async () => {
    if (message !== "") {
      const responsePost = await api.post(`content_chat/`, {
        user1: "clinic",
        user2: customerId,
        message: message,
        type: "sent",
        chat_id: chatId,
      });

      const responsePost2 = await api.post(`content_chat/`, {
        user1: customerId,
        user2: "clinic",
        message: message,
        type: "receive",
        chat_id: chatId,
      });

      if (responsePost && responsePost2) {
        socket.emit("client-sent-message", {
          user1: "clinic",
          user2: customerId,
          message: message,
          type: "sent",
          chat_id: chatId,
        });
        console.log("chay roif ne");
        setMessage("");
      }
    } else {
      // Lấy file đã chọn
      const fileInput = document.getElementById("file");
      const file = fileInput.files[0];
      console.log("file", file);

      // Tạo formData chứa dữ liệu cần gửi
      const formData = new FormData();
      formData.append("image", file);
      formData.append("user1", "clinic");
      formData.append("user2", customerId);
      formData.append("type", "sent");
      formData.append("chat_id", chatId);

      const formData2 = new FormData();
      formData2.append("image", file);
      formData2.append("user1", customerId);
      formData2.append("user2", "clinic");
      formData2.append("type", "receive");
      formData2.append("chat_id", chatId);

      // Thực hiện gọi API sử dụng axios
      try {
        const response1 = await api.post("/content-chat/img", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const response2 = await api.post("/content-chat/img", formData2, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response1 && response2) {
          socket.emit("client-sent-message", {
            user1: "clinic",
            user2: customerId,
            message: file,
            type: "sent",
            chat_id: chatId,
          });
          console.log("chay roif ne");
          setMessage("");
        }
        // getChatContent();
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error:", error);
      }
    }
  };
  useEffect(() => {
    let data = {};
    data.account_id = "clinic";
    socket.emit("login", data);
    socket.on("server-send-data_seft", (message) => {
      // setContentChat((prevMessages) => [...prevMessages, message]);
      // console.log("Chạy vào đây rồi ♥")
      console.log("send data seft ♥: ", message);
      setContentChat((chatContent) => [...chatContent, message]);
    });
    socket.on("server-send-data", (message) => {
      console.log("message", message);
      message.type = "receive";
      // setContentChat((prevMessages) => [...prevMessages, message]);
      // console.log("Chạy vào đây rồi ♥")
      console.log("send data♥: ", message);
      setContentChat((chatContent) => [...chatContent, message]);
    });
  }, []);

  const handleFetchServiceDetail = async (item) => {
    setServiceFormSelect(item.service_form_id);
    setServiceFormDetailList({
      flag: item.veterinarian_referral ? true : false,
      list: item.service_form_details,
    });
    const responseServiceForm = await api.get(
      `/service-form/?booking_id=${boarding_id}`
    );
    if (responseServiceForm) {
      console.log("service form list ne: ", responseServiceForm.data.data);
      setServiceFormList(responseServiceForm.data.data);
    }
  };

  const handleDoneService = async (item) => {
    const responseHandleDone = await api.put(`/service-form-detail/${item.service_form_detail_id}`, {
      status: "done",
    });

    //TĂNG SERVICE HAS DONE LÊN 1
    const serviceFormId = item.service_form_id;
    // Lấy thông tin hiện tại của service form
    const serviceFormResult = await api.get(`/service-form/${serviceFormId}`);
    // Lấy giá trị hiện tại của num_ser_has_done từ response

    const currentNumSerHasDone =
      serviceFormResult.data.data[0].num_ser_has_done;
    // Tăng giá trị lên 1
    const updatedNumSerHasDone = currentNumSerHasDone + 1;

    const isDone =
      serviceFormResult.data.data[0].num_ser_must_do === updatedNumSerHasDone;

    // Gửi yêu cầu PUT để cập nhật giá trị num_ser_has_done
    const increaseResponse = await api.put(`/service-form/${serviceFormId}`, {
      num_ser_has_done: updatedNumSerHasDone,
      status: isDone ? "done" : "paid",
    });
    handleFetchServiceDetail(serviceFormSelect);
    if (responseHandleDone) {
      toast.success("Thay đổi trạng thái thành công!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.left} onClick={() => navigate("/manage-report")}>
          <ion-icon name="chevron-back-outline"></ion-icon>
          <span>Trở về</span>
        </div>
        <div className={styles.right}>
          <div className={styles.nameCustomer}>KH: Nguyễn Trí Công</div>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <div className={styles.headerContent}>
            <div className={styles.roomNumber}>L.{boardingInfo?.cage_id}</div>
            <div className={styles.nestedCode}>{boarding_id}</div>
          </div>
          <div className={styles.bodyContent}>
            <div className={styles.contentReports}>
              <div className={styles.headerReports}>Nội dung báo cáo</div>
              <div className={styles.chatContainer}>
                <div className={styles.chatMessages}>
                  {chatContent &&
                    chatContent.length > 0 &&
                    chatContent.map((message, index) => {
                      if (message?.img_link) {
                        const imgUrl = URL.createObjectURL(
                          new Blob([message?.img_link])
                        );
                        return (
                          <img
                            key={message.content_chat_id}
                            className={`${styles.message} ${styles.imgChat} ${
                              message.type === "sent"
                                ? styles.clinic
                                : styles.customer
                            }`}
                            src={
                              message.img_link
                                ? message.img_link
                                : "https://limosa.vn/wp-content/uploads/2023/08/Loading-la-gi.jpg"
                            }
                            alt=""
                          />
                        );
                      } else
                        return (
                          <div
                            key={message.content_chat_id}
                            className={`${styles.message} ${
                              message.type === "sent"
                                ? styles.clinic
                                : styles.customer
                            }`}
                          >
                            {message.message}
                          </div>
                        );
                    })}
                </div>
              </div>
            </div>
            <div className={styles.contentServices}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Mimus_polyglottus1_cropped.png"
                alt=""
              />
              <Popup
                modal
                trigger={<button className={styles.services}>Dịch vụ</button>}
              >
                <div className={styles.popup}>
                  <div className={styles.headerPopup}>
                    <span>Dịch vụ</span>
                    <span>Dịch vụ chi tiết</span>
                  </div>
                  <div className={styles.bodyPopup}>
                    <div className={styles.addPopup}>
                      {/* <div>{tables}</div>
                      <button
                        onClick={createTable}
                        className={styles.addServices}
                      >
                        + Thêm dịch vụ
                      </button> */}
                      {serviceFormList &&
                        serviceFormList.length > 0 &&
                        serviceFormList.map((item, index) => (
                          <div
                            className={styles.serviceItem}
                            onClick={() => handleFetchServiceDetail(item)}
                            key={index}
                          >
                            {index + 1}. <span>{item.service_form_id}</span>
                          </div>
                        ))}
                    </div>
                    <div className={styles.tablePopup}>
                      <table>
                        <tr>
                          <th>Tên dịch vụ</th>
                          <th>Trạng thái</th>
                        </tr>
                        {serviceFormDetailList &&
                          serviceFormDetailList.list?.length > 0 &&
                          serviceFormDetailList.list.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.note}</td>
                                {item.status === "done" ? (
                                  <td className={styles.flexStatus}>
                                    <ion-icon name="checkmark-circle"></ion-icon>
                                    <span>Đã hoàn thành</span>
                                  </td>
                                ) : (
                                  <td
                                    className={styles.flexStatus}
                                    onClick={() => {
                                      if (!serviceFormDetailList.flag)
                                        handleDoneService(
                                          item
                                        );
                                    }}
                                  >
                                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                                    <span>Đang tiến hành</span>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                      </table>
                    </div>
                  </div>
                </div>
              </Popup>
            </div>
          </div>
          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Nhập tin nhắn của bạn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input type="file" name="file" id="file" />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
        <div className={styles.metaContent}>
          <div className={styles.boxData}>
            <div
              className={styles.boxDataItem}
              onClick={() => setOpenModalProfile(true)}
            >
              <ion-icon name="calendar-clear-outline"></ion-icon>
              <span>Hồ sơ chim khám</span>
            </div>
          </div>
          <Popup
            modal
            trigger={<button className={styles.btnComplete}>Hoàn thành</button>}
          >
            <div className={styles.popupComplete}>
              {tab == 1 && (
                <div>
                  <div className={styles.headerConfirm}>
                    Xác nhận hoàn thành
                  </div>
                  <div className={styles.headerTxtFirst}>
                    Hoàn thành quá trình nội trú cho thú cứng của khách hàng
                  </div>
                  <div className={styles.headerTxtSecond}>Nguyễn Trí Công</div>
                  <div className={styles.headerTxtThird}>
                    Vui lòng tiếp tục để xác nhận.
                  </div>
                </div>
              )}
              {tab == 2 && (
                <div>
                  <div className={styles.headerServiceInfo}>
                    Thông tin dịch vụ
                  </div>
                  <div className={styles.PrintServiceTickets}>
                    <AiOutlinePrinter className={styles.iconPrinter} />
                    In phiếu dịch vụ
                  </div>
                  <div className={styles.serviceUsed}>Dịch vụ đã sử dụng:</div>
                  <div className={styles.serviceInfo}>
                    <div className={styles.serviceFirst}>
                      <div className={styles.serviceLeft}>
                        <span>Cắt móng</span>
                        <p>Vừa</p>
                      </div>
                      <p>x2</p>
                    </div>
                    <div className={styles.serviceFirst}>
                      <div className={styles.serviceLeft}>
                        <span>Cắt mỏ</span>
                        <p>Vừa</p>
                      </div>
                      <p>x2</p>
                    </div>
                    <div className={styles.serviceFirst}>
                      <div className={styles.serviceLeft}>
                        <span>Cắt cánh</span>
                        <p>Vừa</p>
                      </div>
                      <p>x2</p>
                    </div>
                  </div>
                </div>
              )}
              <ProfileBirdModal
                open={openModalProfile}
                onClose={() => setOpenModalProfile(false)}
              />
              <div className={styles.footerContent}>
                {tab !== 1 && (
                  <button
                    className={styles.btnBack}
                    onClick={() => setTab((tab) => tab - 1)}
                  >
                    Quay lại
                  </button>
                )}

                <button
                  className={styles.btnCont}
                  onClick={() => setTab((tab) => tab + 1)}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </Popup>
        </div>
      </div>
    </div>
  );
};

export default Report;
