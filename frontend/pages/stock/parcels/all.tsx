import Layout from "@/components/Layout";
import { GetServerSideProps, NextPage } from "next";
import { User } from "@/types";
import { setCurrentUser } from "@/redux/slices/auth";
import { wrapper } from "@/redux/store";
import product, {
  fetchBaseProducts,
  fetchProducts,
} from "@/redux/slices/product";
import AllProductsTable from "@/components/stock/AllProductsTable";
import { fetchPalettes, fetchParcels } from "@/redux/slices/storage";
import AllParcelsTable from "@/components/stock/AllParcelsTable";

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

    await store.dispatch(fetchProducts());
    await store.dispatch(fetchBaseProducts());
    await store.dispatch(fetchParcels());

    return { props: {} };
  });

const AllOrdersPage: NextPage = () => {
  return (
    <Layout>
      <div className="p-8">
        <AllParcelsTable />
      </div>
    </Layout>
  );
};

export default AllOrdersPage;
