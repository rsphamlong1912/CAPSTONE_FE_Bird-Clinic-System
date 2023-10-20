import React, { useState } from "react";
import styles from "./Report.module.scss";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { MdOutlineDone } from "react-icons/md"
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";
import { AiOutlinePrinter } from "react-icons/ai";

const Report = () => {
    const [openModalProfile, setOpenModalProfile] = useState(false);
    const [tables, setTables] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [tab, setTab] = useState(1);
    

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
                <div className={styles.iconCheck}><MdOutlineDone/></div>
                <div className={styles.unCheck}>X</div>
            </div>
        );

        // Cập nhật danh sách bảng bằng cách thêm bảng mới vào mảng hiện tại
        setTables([...tables, newTable]);
    };
    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.left}>
                    <ion-icon name="chevron-back-outline"></ion-icon>
                    <span>Thoát</span>
                </div>
                <div className={styles.right}>
                    <div className={styles.nameCustomer}>KH: Nguyễn Trí Công</div>
                </div>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.content}>
                    <div className={styles.headerContent}>
                        <div className={styles.roomNumber}>L.013</div>
                        <div className={styles.nestedCode}>BCS_5F2YNK</div>
                    </div>
                    <div className={styles.bodyContent}>
                        <div className={styles.contentReports}>
                            <div className={styles.headerReports}>Nội dung báo cáo</div>
                            <div className={styles.rightReports}>
                                <div className={styles.detail}>
                                    <img src="https://vcdn-vnexpress.vnecdn.net/2023/03/22/chim-toucan-9479-1679447208.jpg" alt="" />
                                    <span>Đây là tình trạng hiện tại của chú chim ! </span>
                                    <p>13:03, 10/04/2023</p>
                                </div>
                            </div>
                            <div className={styles.customerName}>KH: Nguyễn Trí Công</div>
                            <div className={styles.leftReports}>
                                <div className={styles.detail}>
                                    <span>Oki !</span>
                                    <p>13:03, 10/04/2023</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.contentServices}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Mimus_polyglottus1_cropped.png" alt="" />
                            <Popup
                                modal
                                trigger={
                                <button className={styles.services}>
                                    Dịch vụ
                                </button>
                                }
                            >
                                <div className={styles.popup}>
                                    <div className={styles.headerPopup}>
                                        <span>Dịch vụ</span>
                                        <span>Dịch vụ đã làm</span>
                                    </div>
                                    <div className={styles.bodyPopup}>
                                        <div className={styles.addPopup}>
                                            <div>
                                                {tables}
                                            </div>
                                            <button
                                                onClick={createTable}
                                                className={styles.addServices}
                                            >
                                                + Thêm dịch vụ
                                            </button>
                                        </div>
                                        <div className={styles.tablePopup}>
                                            <table>
                                                <tr>
                                                    <th>Tên dịch vụ</th>
                                                    <th>Số lượng</th>
                                                    <th>Thành tiền</th>
                                                </tr>
                                                <tr>
                                                    <td>Cắt móng</td>
                                                    <td>x2</td>
                                                    <td>300.000đ</td>
                                                </tr>
                                                <tr>
                                                    <td>Tỉa lông</td>
                                                    <td>x1</td>
                                                    <td>200.00đ</td>
                                                </tr>
                                                <tr>
                                                    <td>Cắt cánh</td>
                                                    <td>x3</td>
                                                    <td>500.000đ</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </div>
                    </div>
                    <div className={styles.addReport}>+ Thêm báo cáo</div>
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
                        trigger={
                        <button className={styles.btnComplete}>
                            Hoàn thành
                        </button>
                        }
                    >
                        <div className={styles.popupComplete}>
                            {tab == 1 && (
                                <div>
                                    <div className={styles.headerConfirm}>Xác nhận hoàn thành</div>
                                    <div className={styles.headerTxtFirst}>Hoàn thành quá trình nội trú cho thú cứng của khách hàng</div>
                                    <div className={styles.headerTxtSecond}>Nguyễn Trí Công</div>
                                    <div className={styles.headerTxtThird}>Vui lòng tiếp tục để xác nhận.</div>
                                </div>
                            )}
                            {tab == 2 && (
                                <div>
                                    <div className={styles.headerServiceInfo}>Thông tin dịch vụ</div>
                                    <div className={styles.PrintServiceTickets}>
                                        <AiOutlinePrinter className={styles.iconPrinter}/>
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
