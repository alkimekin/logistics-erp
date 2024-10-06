import Layout from "@/components/Layout";
import PrepareTable from "@/components/orders/PrepareTable";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUsers, setCurrentUser } from "@/redux/slices/auth";
import { fetchDispatchNotesWithNoOrder } from "@/redux/slices/order";
import { wrapper } from "@/redux/store";
import { User } from "@/types";
import { fetchBaseProducts } from "@/redux/slices/product";
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

    await store.dispatch(fetchDispatchNotesWithNoOrder());
    await store.dispatch(fetchBaseProducts());
    await store.dispatch(fetchUsers({ authToken }));

    return { props: {} };
  });

const PreparePage: NextPage = () => {
  const dispatch = useAppDispatch();

  const dispatchNotesWithNoOrderLoading = useAppSelector(
    (state) => state.order.dispatchNotesWithNoOrderLoading
  );

  const dispatchNotesWithNoOrder = useAppSelector(
    (state) => state.order.dispatchNotesWithNoOrder
  );

  const baseProducts = useAppSelector((state) => state.product.baseProducts);
  const baseProductsLoading = useAppSelector(
    (state) => state.product.baseProductsLoading
  );

  const users = useAppSelector((state) => state.auth.users);
  const usersLoadingState = useAppSelector(
    (state) => state.auth.usersLoadingState
  );

  console.log(users);

  const dispatchNotes = [...dispatchNotesWithNoOrder];

  if (
    dispatchNotesWithNoOrderLoading != "succeeded" ||
    baseProductsLoading != "succeeded" ||
    usersLoadingState != "succeeded"
  ) {
    return <> Loading... </>;
  } else {
    return (
      <Layout>
        <div className="p-8">
          <PrepareTable
            dispatchNotes={dispatchNotes}
            baseProducts={baseProducts}
            users={users}
          />
        </div>
      </Layout>
    );
  }
};

export default PreparePage;
