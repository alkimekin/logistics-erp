import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const baseUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}/api`;

const login = async (req: NextApiRequest, res: NextApiResponse) => {

  const apiResponse = await fetch(baseUrl + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });

  const apiResponseJson = await apiResponse.json();

  if (apiResponse.status == 200) {
    const serialized_cookie = serialize("token", apiResponseJson.token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialized_cookie);
    console.log("returning auth success code");
    return res.status(200).json({ message: "Login Success" });
  } else {
    console.log(apiResponseJson.error);
    console.log("returning auth error code");
    return res.status(400).json({ message: apiResponseJson.error });
  }
};

export default login;
