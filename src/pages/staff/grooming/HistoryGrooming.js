import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./HistoryGrooming.module.scss";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { api } from "../../../services/axios";
import { ImFilesEmpty } from "react-icons/im";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";

const HistoryGrooming = () => {
    const today = new Date();
    const [customerList, setCustomerList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModalProfile, setOpenModalProfile] = useState(false);
    const [birdProfile, setBirdProfile] = useState([]);
    const [birdProfileSize, setBirdProfileSize] = useState([]);
    const [birdProfileBreed, setBirdProfileBreed] = useState([]);
    const [bookingID, setBookingID] = useState("");

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [dates, setDates] = useState(formatDate(today));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/booking?arrival_date=${dates}`);
                const filterBookings = response.data.data.filter(
                    (booking) =>
                        booking.service_type_id == "ST002" &&
                        booking.status == "finish"
                );
                setCustomerList(filterBookings);
            } catch (error) {
                console.log(error);
            }
        };
        setTimeout(() => {
            setLoading(false);
        }, 850);
        fetchData();
    }, [dates]);

    const handleButtonClick = (item) => {
        handleViewButtonClick(item.bird_id);
        setBookingID(item.booking_id)
        setOpenModalProfile(true);
    };

    const handleViewButtonClick = (birdId) => {
        const getBirdProfile = async () => {
            try {
                const response = await api.get(`/bird/${birdId}`);
                setBirdProfile(response.data.data);
                setBirdProfileSize(response.data.data.bird_breed.bird_size.size);
                setBirdProfileBreed(response.data.data.bird_breed.breed)
                console.log(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getBirdProfile();
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContent}>
                <div className={styles.left}>
                    <h3>LỊCH SỬ KHÁM HÔM NAY</h3>
                </div>
                <div className={styles.right}>
                    <div className={styles.btnSearch}>
                        <SearchOutlined />
                    </div>
                    <input type="text" placeholder="Tìm kiếm khách hàng" name="search" />
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th> STT</th>
                        <th> Khách hàng</th>
                        <th> Chim</th>
                        <th> Dịch vụ</th>
                        <th> Giờ đặt</th>
                        <th> Giờ checkin</th>
                        <th> Số điện thoại</th>
                        <th> Trạng thái</th>
                        <th> Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <>
                            <Loading></Loading>
                            <Loading></Loading>
                            <Loading></Loading>
                            <Loading></Loading>
                            <Loading></Loading>
                            <Loading></Loading>
                            <Loading></Loading>
                        </>
                    )}
                    {!loading && customerList.length === 0 && (
                        <tr className={styles.NoGroomingDetial}>
                            <td colSpan="9">
                                <ImFilesEmpty className={styles.iconEmpty} />
                                <h3 className={styles.txtNoGrooming}>Không có lịch sử tiếp nhận nào.</h3>
                            </td>
                        </tr>
                    )}
                    {!loading &&
                        customerList.map((item, index) => (
                            <tr key={index}>
                                <td> {index + 1} </td>
                                <td>{item.customer_name}</td>
                                <td>{item.bird.name}</td>
                                <td>{item.service_type}</td>
                                <td>{item.estimate_time}</td>
                                <td>{item.checkin_time}</td>
                                <td>
                                    <strong>{item.bird.customer.phone}</strong>
                                </td>
                                <td>
                                    <p
                                        className={`${styles.status} ${item.status === "finish"
                                            ? styles.finish
                                            : ""
                                            } `}
                                    >
                                        {item.status === "finish"
                                            ? "Hoàn tất"
                                            : ""}
                                    </p>
                                </td>
                                <td>
                                    <div className={styles.btnCheckin} onClick={() => handleButtonClick(item)}>Xem</div>
                                </td>

                            </tr>
                        ))}
                </tbody>
            </table>
            <div className={styles.footerContent}>
                <div className={styles.numberResult}>{!loading && customerList.length} kết quả</div>
            </div>
            <ProfileBirdModal
                open={openModalProfile}
                birdProfile={birdProfile}
                birdProfileBreed={birdProfileBreed}
                bookingID={bookingID}
                onClose={() => setOpenModalProfile(false)}
            />
        </div>
    );
};

const Loading = () => {
    return (
        <tr>
            <td>
                <LoadingSkeleton></LoadingSkeleton>
            </td>
            <td>
                <LoadingSkeleton></LoadingSkeleton>
            </td>
            <td>
                <LoadingSkeleton></LoadingSkeleton>
            </td>
            <td>
                <LoadingSkeleton></LoadingSkeleton>
            </td>
            <td>
                <LoadingSkeleton></LoadingSkeleton>
            </td>
            <td>
                <LoadingSkeleton></LoadingSkeleton>
            </td>
            <td>
                <strong>
                    <LoadingSkeleton></LoadingSkeleton>
                </strong>
            </td>
            <td>
                <div className="status being">
                    <LoadingSkeleton></LoadingSkeleton>
                </div>
            </td>
        </tr>
    );
};

export default HistoryGrooming;
