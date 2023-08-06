import Pusher from "pusher-js";
import Echo from "laravel-echo";
import {useEffect} from "react";
import auth from "../../utils/auth";

export default function TestCom() {
    const options = {
        broadcaster: "pusher",
        key: "e013174602072a186b1d",
        cluster: "mt1",
        forceTLS: true,
        encrypted: false,
        //authEndpoint is your apiUrl + /broadcasting/auth
        authEndpoint: process.env.NEXT_PUBLIC_BASE_URL + "broadcasting/auth",
        // As I'm using JWT tokens, I need to manually set up the headers.
        auth: {
            headers: {
                Authorization: `Bearer ${auth() && auth().access_token}`,
                Accept: "application/json",
            },
        },
    };
    const echo = new Echo(options);
    console.log(echo);
    useEffect(() => {
        echo
            .private(`laravel-react-private.${auth() && auth().user.id}`)
            .listen("LaravelReact", (e) => {
                console.log(e);
            });
    });
  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold underline text-red-400 bg-blue-500">
          Hello world!
        </h1>
      </div>
    </>
  );
}
