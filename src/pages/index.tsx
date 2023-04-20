import type { NextPage } from "next";

import MainBox from "@/components/MainBox"

export const URL = "https://www.sharesansar.com/live-trading";

const Home: NextPage = () => {

  return (
    <MainBox url={URL} />
  )
}

export default Home;
