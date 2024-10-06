import { useState } from "react";

import Table from "./table";
import Pagination from "./pagination";

interface MainProps {
  items: Array<any>;
  postsPerPage: number;
}

const Main = (props: MainProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const firstItemToShow = (currentPage - 1) * props.postsPerPage;
  const lastItemToShow = Math.min(
    currentPage * props.postsPerPage,
    props.items.length
  );

  return (
    <div className="relative w-full">
      <Table elements={props.items.slice(firstItemToShow, lastItemToShow)} />
      <Pagination
        postsPerPage={props.postsPerPage}
        totalPosts={props.items.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default Main;
