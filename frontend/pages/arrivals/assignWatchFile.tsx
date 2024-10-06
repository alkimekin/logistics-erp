import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchInHangarArrivals,
  fetchWatchfileLoadedArrivals,
  udpateWatchfileLoadedArrivalsLoadingState,
} from "@/redux/slices/arrival";

import ArrivalPagination from "@/components/arrivals/ArrivalPagination";
import Layout from "@/components/Layout";
import WatchFileTable from "@/components/arrivals/WatchFileTable";
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

    await store.dispatch(fetchWatchfileLoadedArrivals());

    return { props: {} };
  });

const AssignWatchFile: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);

  const dispatch = useAppDispatch();

  const watchfileArrivalsLoading = useAppSelector(
    (state) => state.arrival.watchfileArrivalsLoading
  );

  const watchfileArrivals = useAppSelector(
    (state) => state.arrival.watchfileArrivals
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const items = [...watchfileArrivals];

  const firstItemToShow = (currentPage - 1) * postsPerPage;
  const lastItemToShow = Math.min(currentPage * postsPerPage, items.length);

  if (watchfileArrivalsLoading != "succeeded") {
    return <> Loading... </>;
  } else {
    return (
      <div className="relative w-full">
        <Layout>
          <WatchFileTable
            arrivals={items.slice(firstItemToShow, lastItemToShow)}
          />
        </Layout>
      </div>
    );
  }
};

export default AssignWatchFile;
