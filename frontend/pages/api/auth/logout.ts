import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  const serialized_cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", serialized_cookie);

  return res.status(200).json({ message: "Logout Success" });
};

export default logout;
