import Layout from "@/components/Layout";
import PrepareTable from "@/components/orders/PrepareTable";
import WorkOrderTable from "@/components/forklift/workOrderTable";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentUser } from "@/redux/slices/auth";
import { fetchLiftWorkOrdersInOperatorView } from "@/redux/slices/order";
import { wrapper } from "@/redux/store";
import { User } from "@/types";
import { GetServerSideProps, NextPage } from "next";

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

    await store.dispatch(fetchLiftWorkOrdersInOperatorView({}));

    return { props: {} };
  });

const ForkliftWorkOrderPage: NextPage = () => {
  //TODO: there is lot to do here

  const liftWorkOrders = useAppSelector((state) => state.order.liftWorkOrders);
  const liftWorkOrdersLoading = useAppSelector(
    (state) => state.order.liftWorkOrdersLoading
  );

  if (liftWorkOrdersLoading != "succeeded") {
    return <> Loading... </>;
  } else {
    return (
      <Layout>
        <div className="p-8">
          <WorkOrderTable liftWorkOrders={liftWorkOrders} />
        </div>
      </Layout>
    );
  }
};

export default ForkliftWorkOrderPage;
