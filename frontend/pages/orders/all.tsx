import Layout from "@/components/Layout";
import { GetServerSideProps, NextPage } from "next";
import AllOrdersTable from "@/components/orders/AllOrdersTable";
// import order from "@/redux/slices/order";
import { Order, User } from "@/types";
import { setCurrentUser } from "@/redux/slices/auth";
import { wrapper } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import { fetchOrders } from "@/redux/slices/order";
import { fetchBaseProducts } from "@/redux/slices/product";
import { useState } from "react";
import { Pagination } from "flowbite-react";

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

    await store.dispatch(fetchBaseProducts());
    await store.dispatch(fetchOrders());

    return { props: {} };
  });

const AllOrdersPage: NextPage = () => {
  const orders = useAppSelector((state) => state.order.orders);
  const ordersLoading = useAppSelector((state) => state.order.ordersLoading);

  const baseProducts = useAppSelector((state) => state.product.baseProducts);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;
  const totalPosts = orders.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <Layout>
      <div className="p-8">
        <AllOrdersTable baseProducts={baseProducts} orders={orders} />
      </div>
    </Layout>
  );
};

export default AllOrdersPage;
