import Layout from "@/components/Layout";
import { GetServerSideProps, NextPage } from "next";
import AllOrdersTable from "@/components/orders/AllOrdersTable";
// import order from "@/redux/slices/order";
import { Order, User } from "@/types";
import { setCurrentUser } from "@/redux/slices/auth";
import { wrapper } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import { fetchOrders } from "@/redux/slices/order";
import product, {
  fetchBaseProducts,
  fetchProducts,
} from "@/redux/slices/product";
import AllProductsTable from "@/components/stock/AllProductsTable";
import { Pagination } from "flowbite-react";
import { useState } from "react";
import { fetchPalettes, fetchParcels } from "@/redux/slices/storage";

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
        const response = await fetch(`/api/auth/logout`);
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

    await store.dispatch(fetchProducts());
    await store.dispatch(fetchBaseProducts());
    await store.dispatch(fetchParcels());
    await store.dispatch(fetchPalettes());

    return { props: {} };
  });

const AllPalettesPage: NextPage = () => {
  return (
    <Layout>
      <div className="p-8">
        <AllProductsTable />
      </div>
    </Layout>
  );
};

export default AllPalettesPage;