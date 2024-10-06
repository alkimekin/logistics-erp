import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchInHangarArrivals } from "@/redux/slices/arrival";
import ArrivalTable from "@/components/arrivals/ArrivalTable";
import ArrivalPagination from "@/components/arrivals/ArrivalPagination";
import { fetchHangars, fetchRacks } from "@/redux/slices/storage";
import Layout from "@/components/Layout";
import { wrapper } from "@/redux/store";
import { User } from "@/types";
import { setCurrentUser } from "@/redux/slices/auth";

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (context) => {
    const authToken = context.req.cookies?.token;

    if (authToken) {
      const authApiReq = await fetch(
        `http://${process.env.API_HOST}:${process.env.API_PORT}/api/auth/getTokenUser`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      );

      if (authApiReq.status == 200) {
        const currentUser = (await authApiReq.json()) as User;

        store.dispatch(setCurrentUser({ currentUser }));
      } else {
        const response = await fetch(
          `/api/auth/logout`
        );
        const data = await response.json();

        console.log(data);

        return {
          redirect: {
            permanent: false,
            destination: "/auth/login",
          },
          props: {},
        };
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/auth/login",
        },
        props: {},
      };
    }

    await store.dispatch(fetchHangars());
    await store.dispatch(fetchRacks());
    await store.dispatch(fetchInHangarArrivals());

    return { props: {} };
  });

const AssignRack: NextPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);

  const dispatch = useAppDispatch();

  const inHangarArrivalsLoading = useAppSelector(
    (state) => state.arrival.inHangarArrivalsLoading
  );

  const inHangarArrivals = useAppSelector(
    (state) => state.arrival.inHangarArrivals
  );

  const hangarsLoading = useAppSelector(
    (state) => state.storage.hangarsLoading
  );
  const hangars = useAppSelector((state) => state.storage.hangars);

  const racksLoading = useAppSelector((state) => state.storage.racksLoading);
  const racks = useAppSelector((state) => state.storage.racks);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const firstItemToShow = (currentPage - 1) * postsPerPage;
  const lastItemToShow = Math.min(
    currentPage * postsPerPage,
    inHangarArrivals.length
  );

  if (
    hangarsLoading != "succeeded" &&
    racksLoading != "succeeded" &&
    inHangarArrivalsLoading != "succeeded"
  ) {
    return <> Loading... </>;
  } else {
    return (
      <Layout>
        <div className="relative w-full">
          <ArrivalTable
            arrivals={inHangarArrivals.slice(firstItemToShow, lastItemToShow)}
            hangars={hangars}
            racks={racks}
          />
        </div>
      </Layout>
    );
  }
};

export default AssignRack;
