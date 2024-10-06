import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchConfirmedArrivals } from "@/redux/slices/arrival";
import ArrivalPagination from "@/components/arrivals/ArrivalPagination";
import Layout from "@/components/Layout";
// import Unblock from "@/components/arrivals/Unblock";
import UnblockTable from "@/components/arrivals/UnblockTable";
import { wrapper } from "@/redux/store";
import { setCurrentUser } from "@/redux/slices/auth";
import { User } from "@/types";

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

    await store.dispatch(fetchConfirmedArrivals());

    return { props: {} };
  });

const UnblockArrival: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);

  const dispatch = useAppDispatch();

  const confirmedArrivalsLoading = useAppSelector(
    (state) => state.arrival.confirmedArrivalsLoading
  );

  const confirmedArrivals = useAppSelector(
    (state) => state.arrival.confirmedArrivals
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const items = [...confirmedArrivals];

  const firstItemToShow = (currentPage - 1) * postsPerPage;
  const lastItemToShow = Math.min(currentPage * postsPerPage, items.length);

  if (confirmedArrivalsLoading != "succeeded") {
    return <> Loading... </>;
  } else {
    return (
      <Layout>
        <div className="relative w-full">
          <UnblockTable
            arrivals={items.slice(firstItemToShow, lastItemToShow)}
          />
        </div>
      </Layout>
    );
  }
};

export default UnblockArrival;
