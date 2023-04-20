import { useState } from "react";

import styles from "./MainBox.module.css";

const MainBox: React.FC<{url: string}> = ({ url }) => {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const getData = async () => {
        setIsLoading(true);
        const response = await fetch("api/shareData");

        if (!response.ok){
            console.log("Some Error Occured!");
        }

        const data = await response.json();

        console.log(data);

        setIsLoading(false);
    }

  return (
    <>
    <h1 className={styles.title}>Dad Share REST API</h1>
    {isLoading && <div className={styles.loading}>Loading...</div>}
      <div className={styles.mainBox}>
        <button onClick={getData}>Get Share Data</button>
        <div>Take a Look at the console to view the Data</div>
        <div>Press Ctrl + Shift + J to open the console</div>
        <div className={styles.info}>This REST API uses data from <a href={url}>{url}</a></div>
      </div>
    </>
  );
};

export default MainBox;
