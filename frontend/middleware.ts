// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { wrapper } from "./redux/store";

export default function middleware(req: any) {}

// const middleware = async (req: NextRequest) => {
//   const token = req.cookies.get("token");

//   if (token) {
//     const apiAuthRes = await fetch(
//       "http://localhost:8000/api/auth/getTokenUser",
//       {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer " + token.value,
//         },
//       }
//     );

//     if (apiAuthRes.status == 200) {
//       return NextResponse.next();
//     } else {
//       const logoutResp = await fetch("http:/localhost:3000/api/auth/logout");
//       const logoutRespJson = await logoutResp.json();
//       console.log(logoutRespJson);
//       return NextResponse.redirect(new URL("/auth/login", req.url));
//     }
//   } else {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }
// };

// export const config = {
//   matcher: ["/", "/arrivals/:path*", "/orders/:path*"],
// };

// export default middleware;
