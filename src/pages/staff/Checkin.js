import React from "react";
import styles from "./Checkin.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate"

const Checkin = () => {
  const { currentDate } = useCurrentDate();
  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.left}>DANH SÁCH CHECKIN HÔM NAY</div>
        <div className={styles.right}>{currentDate}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th> STT</th>
            <th> Khách hàng</th>
            <th> Chim</th>
            <th> Dịch vụ</th>
            <th> Giờ đặt</th>
            <th> Bác sĩ phụ trách</th>
            <th> Giờ checkin</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> 1 </td>
            <td>Nguyễn Trí Công</td>
            <td>Sáo nâu</td>
            <td>Khám tổng quát</td>
            <td>09:30</td>
            <td>
              <strong>Phạm Ngọc Long</strong>
            </td>
            <td>09:36</td>
          </tr>
          <tr>
            <td> 2 </td>
            <td>Lê Hũu</td>
            <td>Vẹt xanh</td>
            <td>Lưu trú</td>
            <td>10:30</td>
            <td>
              <strong>Hải Nam</strong>
            </td>
            <td>10:42</td>
          </tr>
          <tr>
            <td> 3 </td>
            <td>Nobi Nobita</td>
            <td>Chích choè</td>
            <td>Khám tổng quát</td>
            <td>10:45</td>
            <td>
              <strong>Hải Nam</strong>
            </td>
            <td>10:45</td>
          </tr>
          <tr>
            <td> 4 </td>
            <td>Sakura Chan</td>
            <td>Vành khuyên</td>
            <td>Khám tổng quát</td>
            <td>11:30</td>
            <td>
              <strong>Phạm Ngọc Long</strong>
            </td>
            <td>11:38</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Checkin;
