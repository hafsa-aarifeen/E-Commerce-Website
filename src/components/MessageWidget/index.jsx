import React, {useContext, useEffect, useRef, useState} from "react";
import ReactTimeAgo from "react-time-ago";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";
import {useRouter} from "next/dist/client/router";
import axios from "axios";
import Star from "../Helpers/icons/Star";
import CheckProductIsExistsInFlashSale from "../Shared/CheckProductIsExistsInFlashSale";
import settings from "../../../utils/settings";
import MessageContext from "../Contexts/MessageContext";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import auth from "../../../utils/auth";
import LoginContext from "../Contexts/LoginContext";
import ServeLangItem from "../Helpers/ServeLangItem";

function Index({pusher}) {
    //== states
    const toggleMessage = useContext(MessageContext);
    const loginPopupBoard = useContext(LoginContext);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [sellerMessages, setSellerMessages] = useState([]);
    const [selectedSellerId, setId] = useState(null);
    const [sellerVendorId, setSellerVendorId] = useState(null);
    const [toggleEmoji, setToggleEmoji] = useState(false);
    const {query} = useRouter();
    const getSlug = query.slug;
    const [isSeller, setSeller] = useState(null);
    const [product, setProduct] = useState(null);
    const [varients, setVarients] = useState(null);
    const [getFirstVarients, setFirstVarients] = useState(null);
    const [price, setPrice] = useState(null);
    const [offerPrice, setOffer] = useState(null);
    //== connector
    const options = {
        broadcaster: "pusher",
        key: pusher?.app_key,
        cluster: pusher?.app_cluster,
        forceTLS: true,
        encrypted: false,
        //authEndpoint is your apiUrl + /broadcasting/auth
        authEndpoint: process.env.NEXT_PUBLIC_BASE_URL + "api/broadcasting/auth",
        // As I'm using JWT tokens, I need to manually set up the headers.
        auth: {
            headers: {
                Authorization: `Bearer ${auth() && auth().access_token}`,
                Accept: "application/json",
            },
        },
    };
    //== methods
    let newMessageHandler = (n, id) => {
        if (auth()) {
            if (n.message.seller_id === id) {
                let newMessage = n.message;
                setSellerMessages((prev) => {
                    const messageFilter = prev.filter((item) => item.id === n.message.id);
                    if (messageFilter.length === 0) {
                        return [...prev, newMessage];
                    } else {
                        return [...prev];
                    }
                });
            } else {
                axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/message-with-seller?token=${auth().access_token}`).then((res) => {
                    if (res && res.data) {
                        setMessages(res.data.seller_list);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }

        }

    };
    const activeSellerHandler = (value,vendorId) => {
        localStorage.setItem('active-chat-seller', `${value}`);
        setId(value);
        setSellerVendorId(vendorId);
        if (auth()) {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/load-active-seller-message/${parseInt(value)}?token=${auth().access_token}`).then((res) => {
                if (res && res.data) {
                    setSellerMessages(res.data.messages);
                    if (messages && messages.length > 0) {
                        setMessages((prev) => {
                            const objIndex = prev.findIndex((item) => item.shop_owner_id === value);
                            prev[objIndex].unread_message = 0;
                            return prev;
                        })
                    }
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    const messageHandler = (e) => {
        setMessage(e.target.value);
    };
    const send = (productId) => {
        if (auth()) {
            if (selectedSellerId) {
                axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/send-message-to-seller?token=${auth().access_token}`, {
                    seller_id: parseInt(selectedSellerId),
                    message: message,
                    product_id: productId?productId:null
                }).then((res) => {
                    if (res) {
                        setSellerMessages(res.data.messages);
                        fixedScrollBottom();
                        setMessage("");
                        setProduct(null);
                    }
                })
            } else {
                return false;
            }

        } else {
            loginPopupBoard.handlerPopup(true);
        }

    };
    const messageRef = useRef(null);
    const fixedScrollBottom = () => {
        const messages = messageRef.current;
        messages.scrollTop = messages.scrollHeight;
    };

    function emojiHandler(emojiData) {
        setMessage((prev) => prev + emojiData.emoji);
    }

    //time module
    const timeAgoHandler = (time) => {
        return new Date(time).getTime();
    };
    //settings
    const {currency_icon} = settings();

    //==effects
    useEffect(() => {
        const firstVarient =
            varients &&
            varients.map((v) =>
                v.active_variant_items.length > 0 ? v.active_variant_items[0] : {}
            );
        setFirstVarients(firstVarient);
    }, [varients]);
    useEffect(() => {
        if (getFirstVarients) {
            const prices =
                getFirstVarients &&
                getFirstVarients.map((v) => (
                    v.price ? v.price : 0));
            const sumPrice = parseInt(
                prices.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) +
                parseInt(product.price)
            );
            setPrice(sumPrice);
            if (product.offer_price) {
                const sumOfferPrice = parseInt(
                    prices.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) +
                    parseInt(product.offer_price)
                );
                setOffer(sumOfferPrice);
            }
        }
    }, [getFirstVarients]);
    useEffect(() => {
        if (getSlug) {
            if (!isSeller && !product) {
                axios
                    .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/product/${getSlug}`)
                    .then((res) => {
                        if (res) {
                            if (res.data) {
                                if (
                                    res.data.is_seller_product ||
                                    res.data.is_seller_product === "true"
                                ) {
                                    setProduct(res.data.product);
                                    setSeller(res.data.is_seller_product);
                                    setVarients(res.data.product.active_variants);
                                }
                            }
                        } else {
                            setProduct(false);
                        }
                    });
            }
        }
    });
    const fetchChat =()=>{
        if(auth()){
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/message-with-seller?token=${auth().access_token}`).then((res) => {
                if (res && res.data) {
                    setMessages(res.data.seller_list)
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    useEffect(() => {
        if(!messages || messages.length===0){
            fetchChat();
        }
    },[]);
    useEffect(() => {
        if (messages && messages.length > 0) {
            fixedScrollBottom();
        }
    });
    useEffect(() => {
        const messageBody = document.getElementById("message-body");
        if (sellerMessages && sellerMessages.length > 0) {
            if (messageBody && messageBody.offsetHeight <= 390) {
                messageRef.current.style.display = "flex";
                messageRef.current.style.alignItems = "end";
            } else {
                messageRef.current.style.display = "";
                messageRef.current.style.alignItems = "";
                fixedScrollBottom();
            }
        } else {
            messageRef.current.style.display = "";
            messageRef.current.style.alignItems = "";
            fixedScrollBottom();
        }
    }, [sellerMessages, selectedSellerId]);
    //add new seller
    useEffect(() => {
        if (toggleMessage.newSeller) {
            const newSellerObj = {
                shop_owner_id: toggleMessage.newSeller.user_id,
                shop_owner: toggleMessage.newSeller.user.name,
                shop_name: toggleMessage.newSeller.shop_name,
                shop_or_vendor_id: toggleMessage.newSeller.id,
                shop_slug: toggleMessage.newSeller.slug,
                shop_logo: toggleMessage.newSeller.logo,
                unread_message: 0,
                messages: [],
            }
            const sellerExistOrNot =messages&& messages.length>0&& messages.find((seller) => seller.shop_or_vendor_id === toggleMessage.newSeller.id);
            if (!sellerExistOrNot) {
                setMessages((prev) => [newSellerObj, ...prev]);
            }
        }
    }, [toggleMessage, toggleMessage.newSeller]);

    //==watches
    const echo = new Echo(options);
    const [listenerAdded, setListenerAdded] = useState(false);
    useEffect(() => {
        if (!listenerAdded) {
            echo
                .private(`seller-to-user-message.${auth() && auth().user.id}`)
                .listen("SellerToUser", (e) => {
                    let activeSeller = localStorage.getItem('active-chat-seller');
                    newMessageHandler(e, activeSeller)
                });
            setListenerAdded(true);
        }
        return () => {
            echo.leave('seller-to-user-message');
        }
    }, [echo, listenerAdded]);
    const messageToggleAction = () => {
        if(auth()){
            setSeller(null);
            setProduct(null);
            toggleMessage.toggleHandler();
            if(!messages || messages.length===0){
                fetchChat();
            }else{
                return false;
            }
        }else{
            loginPopupBoard.handlerPopup(true);
        }
    };
    return (
        <>
            {toggleMessage.toggle === false && (
                <button
                    onClick={messageToggleAction}
                    type="button"
                    className={`w-[150px] print:hidden fixed xl:right-[180px] right-[-56px] transform rotate-90 xl:rotate-0 z-30  xl:bottom-0 bottom-[150px] h-[38px] bg-qyellow justify-center flex space-x-2.5 items-center cursor-pointer`}
                >
                      <span>
                        <svg
                            width="21"
                            height="19"
                            viewBox="0 0 21 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                              d="M1.30898 18.0944C0.962386 18.0925 0.630508 17.954 0.385424 17.7089C0.14034 17.4638 0.00183875 17.132 0 16.7854V6.01951C0.00184787 5.30162 0.287849 4.61366 0.795479 4.10603C1.30311 3.5984 1.99107 3.31239 2.70897 3.31055H15.4838C16.2029 3.31054 16.8927 3.59573 17.4018 4.10356C17.9109 4.61139 18.1979 5.30041 18.1998 6.01951V13.1944C18.1998 13.9135 17.9146 14.6033 17.4068 15.1124C16.8989 15.6216 16.2099 15.9085 15.4908 15.9104H4.83694C4.71593 15.9114 4.59833 15.9506 4.50094 16.0224L2.09997 17.8354C1.87104 18.0045 1.59364 18.0954 1.30898 18.0944ZM2.70897 4.71053C2.36237 4.71237 2.03049 4.85087 1.78541 5.09595C1.54032 5.34104 1.40182 5.67291 1.39998 6.01951V16.6104L3.66095 14.9024C4.00115 14.6497 4.41318 14.5124 4.83694 14.5104H15.4838C15.8328 14.5104 16.1675 14.3718 16.4143 14.125C16.6611 13.8782 16.7998 13.5434 16.7998 13.1944V6.01951C16.7979 5.67291 16.6594 5.34104 16.4144 5.09595C16.1693 4.85087 15.8374 4.71237 15.4908 4.71053H2.70897Z"
                              fill="black"
                          />
                          <path
                              d="M11.8601 10.3746C12.2467 10.3746 12.5601 10.0612 12.5601 9.6746C12.5601 9.28801 12.2467 8.97461 11.8601 8.97461C11.4736 8.97461 11.1602 9.28801 11.1602 9.6746C11.1602 10.0612 11.4736 10.3746 11.8601 10.3746Z"
                              fill="black"
                          />
                          <path
                              d="M9.1414 10.3746C9.52799 10.3746 9.84139 10.0612 9.84139 9.6746C9.84139 9.28801 9.52799 8.97461 9.1414 8.97461C8.7548 8.97461 8.44141 9.28801 8.44141 9.6746C8.44141 10.0612 8.7548 10.3746 9.1414 10.3746Z"
                              fill="black"
                          />
                          <path
                              d="M6.34062 10.3746C6.72721 10.3746 7.04061 10.0612 7.04061 9.6746C7.04061 9.28801 6.72721 8.97461 6.34062 8.97461C5.95402 8.97461 5.64062 9.28801 5.64062 9.6746C5.64062 10.0612 5.95402 10.3746 6.34062 10.3746Z"
                              fill="black"
                          />
                          <path
                              d="M20.2998 11.0116C20.1141 11.0116 19.9361 10.9378 19.8048 10.8066C19.6735 10.6753 19.5998 10.4972 19.5998 10.3116V3.22068C19.598 2.87409 19.4595 2.54221 19.2144 2.29712C18.9693 2.05204 18.6374 1.91354 18.2908 1.9117H4.19999C4.01434 1.9117 3.8363 1.83795 3.70502 1.70668C3.57375 1.5754 3.5 1.39736 3.5 1.21171C3.5 1.02606 3.57375 0.848015 3.70502 0.716741C3.8363 0.585468 4.01434 0.511719 4.19999 0.511719H18.2908C19.0087 0.513567 19.6967 0.799568 20.2043 1.3072C20.7119 1.81483 20.9979 2.50279 20.9998 3.22068V10.3116C20.9998 10.4972 20.926 10.6753 20.7948 10.8066C20.6635 10.9378 20.4854 11.0116 20.2998 11.0116Z"
                              fill="black"
                          />
                        </svg>
                      </span>
                    <span className={`text-base font-medium text-qblack`}>{ServeLangItem().Messages}</span>
                </button>
            )}
            <div className={`fixed print:hidden xl:right-[180px] right-0 bottom-0 w-full sm:w-auto`} style={{zIndex:'9999999999999'}}>
                {/*w-[576px] h-[474px]*/}
                <div
                    className={`bg-white transform   transition duration-700 ease-in-out ${
                        toggleMessage.toggle ? "translate-y-0 md:w-[576px] w-full md:h-[474px] h-full" : "translate-y-[480px] w-0 h-0"
                    }`}
                    style={{boxShadow: "0px 4px 109px rgba(0, 0, 0, 0.12)"}}
                >
                    <div className={`w-full h-[38px] bg-qyellow text-qblack`}>
                        <div
                            className={`w-full h-full flex justify-between items-center px-[26px]`}
                        >
                            <div className={`flex space-x-2.5 items-center`}>
                <span>
                  <svg
                      width="21"
                      height="19"
                      viewBox="0 0 21 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        d="M1.30898 18.0944C0.962386 18.0925 0.630508 17.954 0.385424 17.7089C0.14034 17.4638 0.00183875 17.132 0 16.7854V6.01951C0.00184787 5.30162 0.287849 4.61366 0.795479 4.10603C1.30311 3.5984 1.99107 3.31239 2.70897 3.31055H15.4838C16.2029 3.31054 16.8927 3.59573 17.4018 4.10356C17.9109 4.61139 18.1979 5.30041 18.1998 6.01951V13.1944C18.1998 13.9135 17.9146 14.6033 17.4068 15.1124C16.8989 15.6216 16.2099 15.9085 15.4908 15.9104H4.83694C4.71593 15.9114 4.59833 15.9506 4.50094 16.0224L2.09997 17.8354C1.87104 18.0045 1.59364 18.0954 1.30898 18.0944ZM2.70897 4.71053C2.36237 4.71237 2.03049 4.85087 1.78541 5.09595C1.54032 5.34104 1.40182 5.67291 1.39998 6.01951V16.6104L3.66095 14.9024C4.00115 14.6497 4.41318 14.5124 4.83694 14.5104H15.4838C15.8328 14.5104 16.1675 14.3718 16.4143 14.125C16.6611 13.8782 16.7998 13.5434 16.7998 13.1944V6.01951C16.7979 5.67291 16.6594 5.34104 16.4144 5.09595C16.1693 4.85087 15.8374 4.71237 15.4908 4.71053H2.70897Z"
                        fill="black"
                    />
                    <path
                        d="M11.8601 10.3746C12.2467 10.3746 12.5601 10.0612 12.5601 9.6746C12.5601 9.28801 12.2467 8.97461 11.8601 8.97461C11.4736 8.97461 11.1602 9.28801 11.1602 9.6746C11.1602 10.0612 11.4736 10.3746 11.8601 10.3746Z"
                        fill="black"
                    />
                    <path
                        d="M9.1414 10.3746C9.52799 10.3746 9.84139 10.0612 9.84139 9.6746C9.84139 9.28801 9.52799 8.97461 9.1414 8.97461C8.7548 8.97461 8.44141 9.28801 8.44141 9.6746C8.44141 10.0612 8.7548 10.3746 9.1414 10.3746Z"
                        fill="black"
                    />
                    <path
                        d="M6.34062 10.3746C6.72721 10.3746 7.04061 10.0612 7.04061 9.6746C7.04061 9.28801 6.72721 8.97461 6.34062 8.97461C5.95402 8.97461 5.64062 9.28801 5.64062 9.6746C5.64062 10.0612 5.95402 10.3746 6.34062 10.3746Z"
                        fill="black"
                    />
                    <path
                        d="M20.2998 11.0116C20.1141 11.0116 19.9361 10.9378 19.8048 10.8066C19.6735 10.6753 19.5998 10.4972 19.5998 10.3116V3.22068C19.598 2.87409 19.4595 2.54221 19.2144 2.29712C18.9693 2.05204 18.6374 1.91354 18.2908 1.9117H4.19999C4.01434 1.9117 3.8363 1.83795 3.70502 1.70668C3.57375 1.5754 3.5 1.39736 3.5 1.21171C3.5 1.02606 3.57375 0.848015 3.70502 0.716741C3.8363 0.585468 4.01434 0.511719 4.19999 0.511719H18.2908C19.0087 0.513567 19.6967 0.799568 20.2043 1.3072C20.7119 1.81483 20.9979 2.50279 20.9998 3.22068V10.3116C20.9998 10.4972 20.926 10.6753 20.7948 10.8066C20.6635 10.9378 20.4854 11.0116 20.2998 11.0116Z"
                        fill="black"
                    />
                  </svg>
                </span>
                                <span className={`text-base font-medium text-qblack`}>
                 {ServeLangItem().Messages}
                </span>
                            </div>
                            <button onClick={messageToggleAction} type="button">
                                <svg
                                    width="21"
                                    height="21"
                                    viewBox="0 0 21 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10.5 0C4.70775 0 0 4.70775 0 10.5C0 16.2923 4.70775 21 10.5 21C16.2923 21 21 16.2923 21 10.5C21 4.70775 16.2923 0 10.5 0ZM10.5 19.9401C5.2993 19.9401 1.05986 15.7007 1.05986 10.5C1.05986 5.2993 5.2993 1.05986 10.5 1.05986C15.7007 1.05986 19.9401 5.2993 19.9401 10.5C19.9401 15.7007 15.7007 19.9401 10.5 19.9401Z"
                                        fill="black"
                                    />
                                    <path
                                        d="M11.2409 10.4507L14.3219 7.36975C14.5191 7.17256 14.5191 6.82749 14.3219 6.63031C14.1248 6.43313 13.7797 6.43313 13.5825 6.63031L10.5015 9.7113L7.42053 6.63031C7.22334 6.43313 6.87827 6.43313 6.68109 6.63031C6.48391 6.82749 6.48391 7.17256 6.68109 7.36975L9.76208 10.4507L6.68109 13.5071C6.48391 13.7043 6.48391 14.0493 6.68109 14.2465C6.77968 14.3451 6.92757 14.3944 7.05081 14.3944C7.17405 14.3944 7.32194 14.3451 7.42053 14.2465L10.5015 11.1655L13.5825 14.2465C13.6811 14.3451 13.829 14.3944 13.9522 14.3944C14.0755 14.3944 14.2233 14.3451 14.3219 14.2465C14.5191 14.0493 14.5191 13.7043 14.3219 13.5071L11.2409 10.4507Z"
                                        fill="black"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div
                        className={`w-full md:flex`}
                        style={{height: `calc(100% - 38px)`}}
                    >
                        <div
                            className={`md:w-[240px] bg-[#FFF2DA] md:bg-white  w-full md:h-full overflow-x-scroll md:overflow-x-hidden border-r border-[#E9E9E9] md:overflow-y-scroll overflow-style-none`}
                        >
                            <div className={`seller-list w-full`}>
                                <ul className={`flex flex-row md:flex-col`}>
                                    {messages && messages.length > 0 && messages.map((item, i) => (
                                        <li key={i} onClick={() => activeSellerHandler(item.shop_owner_id,item.shop_or_vendor_id)}
                                            className={`flex w-[150px] md:w-auto space-x-3 items-center px-2.5 py-3 hover:bg-[#FFF2DA] cursor-pointer cursor-pointer ${item.shop_owner_id === selectedSellerId ? 'bg-[#FFF2DA]' : ''}`}
                                        >
                                            <div
                                                className={`w-[44px] h-[44px]  relative `}
                                            >
                                                <div
                                                    className="w-full h-full rounded-full overflow-hidden bg-[#FAF9FA] relative shadow-lg">
                                                    <Image
                                                        layout="fill"
                                                        objectFit="contain"
                                                        src={process.env.NEXT_PUBLIC_BASE_URL + item.shop_logo}
                                                        alt="seller"
                                                    />
                                                </div>
                                                {item.unread_message > 0 && (
                                                    <div
                                                        className="w-[15px] h-[15px] inline-block flex justify-center items-center rounded-full bg-qyellow text-qblack absolute right-0 top-0 text-xs">
                                                        <span>{item.unread_message > 99 ? "99" : item.unread_message}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`flex-1`}>
                                                <div className={`flex flex-col space-y-1`}>
                                                    <p className={`font-medium text-base text-qblack line-clamp-1`}>
                                                        {item.shop_name}
                                                    </p>
                                                    {item.messages && item.messages.length > 0 && (
                                                        <div className="md:block hidden">
                                                            <p className={`text-xs text-qgray line-clamp-1 `}>{item.messages[item.messages.length - 1].message}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}


                                </ul>
                            </div>
                        </div>
                        <div className={`md:w-[336px] w-full relative`}>
                            {toggleEmoji && (
                                <div className={`absolute -left-4 -top-16 z-20`}>
                                    <div
                                        onClick={() => setToggleEmoji(!toggleEmoji)}
                                        className={`w-full h-full fixed left-0 top-0`}
                                    ></div>
                                    <EmojiPicker onEmojiClick={emojiHandler}/>
                                </div>
                            )}
                            <div>
                                {/*message body*/}
                                <div
                                    ref={messageRef}
                                    className={`w-full h-[392px] px-2.5 pt-2.5 overflow-y-scroll overflow-style-none relative`}
                                >
                                    {product && parseInt(product.vendor_id)===sellerVendorId&& (
                                        <div
                                            className={`fixed w-[318px] h-[100px] bg-qblack p-3 top-[50px] z-10`}
                                        >
                                            <div className={`flex space-x-2.5 items-center`}>
                                                <div
                                                    className={`w-[58px] h-[63px] rounded relative bg-white`}
                                                >
                                                    <Image
                                                        layout="fill"
                                                        objectFit="contain"
                                                        src={`${
                                                            process.env.NEXT_PUBLIC_BASE_URL +
                                                            product.thumb_image
                                                        }`}
                                                        alt="seller"
                                                    />
                                                </div>
                                                <div className={`flex-1 flex flex-col`}>
                                                    {/*  rating */}
                                                    <div className="reviews flex space-x-[1px]">
                                                        {Array.from(
                                                            Array(parseInt(product.averageRating)),
                                                            () => (
                                                                <span
                                                                    key={
                                                                        parseInt(product.averageRating) +
                                                                        Math.random()
                                                                    }
                                                                >
                                <Star/>
                              </span>
                                                            )
                                                        )}
                                                        {parseInt(product.averageRating) < 5 && (
                                                            <>
                                                                {Array.from(
                                                                    Array(5 - parseInt(product.averageRating)),
                                                                    () => (
                                                                        <span
                                                                            key={
                                                                                parseInt(product.averageRating) +
                                                                                Math.random()
                                                                            }
                                                                            className="text-gray-500"
                                                                        >
                                    <Star defaultValue={false}/>
                                  </span>
                                                                    )
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    <p
                                                        className={`text-white text-xs font-medium leading-[24px] line-clamp-1`}
                                                    >
                                                        {product.name}
                                                    </p>
                                                    <div className="flex space-x-2 items-baseline">
                          <span
                              suppressHydrationWarning
                              className={`main-price  font-600  ${
                                  offerPrice
                                      ? "line-through text-qgray text-xs"
                                      : "text-qred text-xs"
                              }`}
                          >
                            {offerPrice ? (
                                <span>{currency_icon + price}</span>
                            ) : (
                                <CheckProductIsExistsInFlashSale
                                    id={product.id}
                                    price={price}
                                />
                            )}
                          </span>
                                                        {offerPrice && (
                                                            <span
                                                                suppressHydrationWarning
                                                                className="offer-price text-qred font-600 text-xs ml-2"
                                                            >
                              <CheckProductIsExistsInFlashSale
                                  id={product.id}
                                  price={offerPrice}
                              />
                            </span>
                                                        )}
                                                    </div>
                                                    <button onClick={()=>send(product.id)} style={{left: "calc(50% - 46px)", bottom: "-16px"}}
                                                            type="button"
                                                            className={`w-[120px] h-[32px] bg-white text-sm text-qyellow font-semibold absolute shadow-lg`}
                                                    >
                                                        {ServeLangItem().Send_Product}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {sellerMessages && sellerMessages.length > 0 && selectedSellerId ? (
                                        <>
                                            <div id="message-body" className="w-full">
                                                {sellerMessages.map((item, i) => (
                                                    <>
                                                        {item.send_by === 'seller' ? (
                                                            <div key={i} className="mb-2 mr-10">
                                                                {/*receiver*/}
                                                                <div className={`w-full`}>
                                                                    <div
                                                                        className="bg-[#E8EEF2] py-[8px] px-[17px] flex justify-center rounded-[40px] text-qblack text-sm"
                                                                        style={{
                                                                            maxWidth: "fit-content",
                                                                            minWidth: "82px",
                                                                        }}
                                                                    >
                                                                        <p className="text-justify">{item.message}</p>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={` flex space-x-1.5 items-center`}>
                                                                    <p
                                                                        className={`text-xs text-[#797979] leading-[24px] flex space-x-1.5 items-center`}
                                                                    >
                                                                        <ReactTimeAgo
                                                                            date={timeAgoHandler(new Date(item.created_at))}
                                                                            locale="en-US"
                                                                        />
                                                                    </p>
                                                                    <span>
                                                                                               <svg
                                                                                                   width="17"
                                                                                                   height="8"
                                                                                                   viewBox="0 0 17 8"
                                                                                                   fill="none"
                                                                                                   xmlns="http://www.w3.org/2000/svg"
                                                                                               >
                                                                                               <path
                                                                                                   d="M9.72727 1L3.72727 7L1 4.27273"
                                                                                                   stroke="#27AE60"
                                                                                                   strokeWidth="1.5"
                                                                                                   strokeLinecap="round"
                                                                                                   strokeLinejoin="round"
                                                                                               />
                                                                                               <path
                                                                                                   d="M15.7273 1L9.72727 7L7 4.27273"
                                                                                                   stroke="#27AE60"
                                                                                                   strokeWidth="1.5"
                                                                                                   strokeLinecap="round"
                                                                                                   strokeLinejoin="round"
                                                                                               />
                                                                                               </svg>
                                                                                               </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div key={i}
                                                                 className="mb-2 ml-10">

                                                                <div>
                                                                    {/*product*/}
                                                                    {item.product && (
                                                                        <div
                                                                            className={`w-full bg-[#FFF2DA] p-3 mb-2`}
                                                                        >
                                                                            <div className={`flex space-x-2.5 items-center`}>
                                                                                <div
                                                                                    className={`w-[58px] h-[63px] relative bg-white`}
                                                                                >
                                                                                    <Image
                                                                                        layout="fill"
                                                                                        objectFit="contain"
                                                                                        src={`${
                                                                                            process.env.NEXT_PUBLIC_BASE_URL +
                                                                                            item.product.thumb_image
                                                                                        }`}
                                                                                        alt="seller"
                                                                                    />
                                                                                </div>
                                                                                <div className={`flex-1 flex flex-col`}>
                                                                                    {/*  rating */}
                                                                                    <div className="reviews flex space-x-[1px]">
                                                                                        {Array.from(
                                                                                            Array(parseInt(item.product.averageRating)),
                                                                                            () => (
                                                                                                <span
                                                                                                    key={
                                                                                                        parseInt(item.product.averageRating) +
                                                                                                        Math.random()
                                                                                                    }
                                                                                                >
                                <Star/>
                              </span>
                                                                                            )
                                                                                        )}
                                                                                        {parseInt(item.product.averageRating) < 5 && (
                                                                                            <>
                                                                                                {Array.from(
                                                                                                    Array(5 - parseInt(item.product.averageRating)),
                                                                                                    () => (
                                                                                                        <span
                                                                                                            key={
                                                                                                                parseInt(item.product.averageRating) +
                                                                                                                Math.random()
                                                                                                            }
                                                                                                            className="text-gray-500"
                                                                                                        >
                                    <Star defaultValue={false}/>
                                  </span>
                                                                                                    )
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                    <p
                                                                                        className={`text-qblack text-xs font-medium leading-[24px] line-clamp-1`}
                                                                                    >
                                                                                        {item.product.name}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {/*sender*/}
                                                                    {item.message && (
                                                                        <div className={`flex justify-end `}>
                                                                            <div>
                                                                                <div
                                                                                    className="bg-qyellow py-[8px] px-[17px] flex justify-center rounded-[40px] text-qblack text-sm"
                                                                                    style={{
                                                                                        maxWidth: "fit-content",
                                                                                        minWidth: "82px",
                                                                                    }}
                                                                                >
                                                                                    <p className="text-justify">{item.message}</p>
                                                                                </div>
                                                                                <div
                                                                                    className={`flex justify-end`}>
                                                                                    <div
                                                                                        className={` flex space-x-1.5 items-center`}>
                                                                                        <p
                                                                                            className={`text-xs text-[#797979] leading-[24px] text-end`}
                                                                                        >
                                                                                            <ReactTimeAgo
                                                                                                date={timeAgoHandler(new Date(item.created_at))}
                                                                                                locale="en-US"
                                                                                            />
                                                                                        </p>
                                                                                        <span>
                                               <svg
                                                   width="17"
                                                   height="8"
                                                   viewBox="0 0 17 8"
                                                   fill="none"
                                                   xmlns="http://www.w3.org/2000/svg"
                                               >
                                               <path
                                                   d="M9.72727 1L3.72727 7L1 4.27273"
                                                   stroke="#27AE60"
                                                   strokeWidth="1.5"
                                                   strokeLinecap="round"
                                                   strokeLinejoin="round"
                                               />
                                               <path
                                                   d="M15.7273 1L9.72727 7L7 4.27273"
                                                   stroke="#27AE60"
                                                   strokeWidth="1.5"
                                                   strokeLinecap="round"
                                                   strokeLinejoin="round"
                                               />
                                               </svg>
                                               </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div>
                                                <div className="mb-5 flex justify-center">
                                                    <Image src="/assets/images/not-message-found.png" width={158}
                                                           height={128} objectFit="scale-down" alt="no message"/>
                                                </div>
                                                <div>
                                                    <h1 className="text-[#1D1D1D] font-bold text-[20px] text-center">{ServeLangItem().No_Message_yet}</h1>
                                                    <p className="text-[#797979] text-sm text-center"> {ServeLangItem().Its_seems__No_Message_in_your_inbox}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )

                                    }
                                </div>
                                {/*input field*/}
                                <div
                                    className={`w-full h-[44px] flex justify-between bg-[#E2E8EB] pl-3`}
                                >
                                    {/*  message box*/}
                                    <div className={`md:w-[240px] w-full h-full`}>
                                        <input
                                            onChange={(e) => messageHandler(e)}
                                            onKeyDown={(e) => e.key === "Enter" && send()}
                                            value={message}
                                            placeholder={`Message`}
                                            className={`w-full h-full placeholder:text-[#85959E] text-[#85959E] focus:outline-none bg-[#E2E8EB]`}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-5">
                                        {/* emoji*/}
                                        <button
                                            onClick={() => setToggleEmoji(!toggleEmoji)}
                                            type="button"
                                        >
                  <span>
                    <svg
                        width="19"
                        height="18"
                        viewBox="0 0 19 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                          d="M16.0913 2.63603C14.355 0.936172 12.0465 0 9.5911 0C7.13569 0 4.82715 0.936172 3.0909 2.63603C1.35465 4.33589 0.398438 6.59605 0.398438 9C0.398438 11.4039 1.35465 13.6641 3.0909 15.364C4.82715 17.0638 7.13569 18 9.5911 18C12.0465 18 14.355 17.0638 16.0913 15.364C17.8275 13.6641 18.7838 11.4039 18.7838 9C18.7838 6.59605 17.8275 4.33589 16.0913 2.63603ZM5.89964 7.35013C5.89964 6.84709 6.31778 6.43785 6.83159 6.43785C7.34539 6.43785 7.76339 6.84709 7.76339 7.35013C7.76339 7.85316 7.34539 8.26241 6.83159 8.26241C6.31778 8.26241 5.89964 7.85316 5.89964 7.35013ZM12.7944 11.5242C12.1345 12.6413 10.9065 13.3351 9.58984 13.3351C8.27061 13.3351 7.04143 12.6392 6.38217 11.5192C6.23362 11.2668 6.32213 10.9443 6.57995 10.799C6.83762 10.6534 7.16697 10.7402 7.31552 10.9925C7.78303 11.787 8.65452 12.2804 9.58984 12.2804C10.5233 12.2804 11.3938 11.7883 11.8619 10.9962C12.0109 10.7441 12.3404 10.658 12.5979 10.8038C12.8554 10.9495 12.9434 11.2722 12.7944 11.5242ZM12.3456 8.26241C11.8316 8.26241 11.4136 7.85316 11.4136 7.35013C11.4136 6.84709 11.8316 6.43785 12.3456 6.43785C12.8592 6.43785 13.2772 6.84709 13.2772 7.35013C13.2774 7.85316 12.8592 8.26241 12.3456 8.26241Z"
                          fill="#85959E"
                      />
                    </svg>
                  </span>
                                        </button>
                                        <button
                                            onClick={() => send()}
                                            type="button"
                                            className={`w-[50px] h-full bg-qyellow flex justify-center items-center text-qblack`}
                                        >
                  <span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="26"
                        height="26"
                        className={`fill-current`}
                    >
                      <path fill="none" d="M0 0h24v24H0z"/>
                      <path
                          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"/>
                    </svg>
                  </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default Index;