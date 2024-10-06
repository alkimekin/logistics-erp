import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import React, { useEffect, useState } from "react";

import { Arrival, Palette, User } from "@/types";

import Layout from "@/components/Layout";
import NewArrival from "@/components/arrivals/NewArrival";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createNewArrival } from "@/redux/slices/arrival";
import { wrapper } from "@/redux/store";
import { fetchBaseProducts } from "@/redux/slices/product";
import { fetchHangars, fetchRacks } from "@/redux/slices/storage";
import { setCurrentUser } from "@/redux/slices/auth";
import { Html5QrcodeScanner } from "html5-qrcode";

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
    await store.dispatch(fetchHangars());
    await store.dispatch(fetchRacks());

    return { props: {} };
  });

const NewArrivalPage: NextPage = () => {
  return (
    <>
      <div className="min-h-full w-full">
        <Layout>
          <div className="p-8">
            <NewArrival />
          </div>
        </Layout>
      </div>
    </>
  );
};

export default NewArrivalPage;
