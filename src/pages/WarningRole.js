import React from 'react';
import styles from "./WarningRole.module.scss"

const WarningRole = () => {
    return (
        <div className={styles.card}>
        <div className={styles.grid}>
            <div className={styles.error}>
                  <span>Không tìm thấy!
                  </span>
              <p style={{fontWeight: "700"}}>Vui lòng quay lại!</p>
            {/* <button className={styles.button}>Trở về</button> */}
         </div>
          <div className={styles.img}>
          <img src={require("../assets/404.png")} alt="" />
         </div>
      </div>
   </div> 
    );
};

export default WarningRole;