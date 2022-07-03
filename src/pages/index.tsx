import { NextPage } from "next/types";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["hello", { text: "svete" }]);
  const utils = trpc.useContext();

  return (
    <div>
      <p>{hello.data?.greeting}</p>
      <button
        onClick={() => {
          utils.invalidateQueries("hello");
        }}
      >
        random
      </button>
    </div>
  );
};

export default Home;
