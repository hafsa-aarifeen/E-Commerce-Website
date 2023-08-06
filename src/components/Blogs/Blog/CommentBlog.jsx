import { useEffect, useState } from "react";
import InputCom from "../../Helpers/InputCom";
import LoaderStyleOne from "../../Helpers/Loaders/LoaderStyleOne";
import Image from "next/image";
import apiRequest from "../../../../utils/apiRequest";
import { toast } from "react-toastify";
import ServeLangItem from "../../Helpers/ServeLangItem";
export default function CommentBlog({ comments, blog, fetchComments }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [reviewLoading, setLoading] = useState(false);
  const [commnets, setComments] = useState(comments);
  const reviewAction = async () => {
    setLoading(true);
    await apiRequest
      .blogComment({
        name: name,
        email: email,
        comment: message,
        blog_id: blog.id,
      })
      .then(async (res) => {
        setLoading(false);
        const message = res.data && res.data.message;
        toast.success(message, {
          position: "bottom-center",
          autoClose: 4000,
          closeOnClick: true,
          pauseOnHover: false,
        });
        setName("");
        setEmail("");
        setMessage("");
        fetchComments(blog.slug);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        const message = err.response && err.response.data.message;
        toast.error(message, {
          position: "bottom-center",
          autoClose: 4000,
          closeOnClick: true,
          pauseOnHover: false,
        });
      });
  };
  useEffect(() => {
    setComments(comments);
  }, [comments]);

  return (
    <>
      <div className="write-review w-full mb-[30px]">
        <h1 className="text-2xl font-bold text-qblack mb-5">
          {ServeLangItem()?.leave_a_comment}
        </h1>
        <div className="w-full review-form ">
          <div className="sm:flex sm:space-x-[30px] rtl:space-x-reverse items-center mb-5 w-full">
            <div className="w-full mb-5 sm:mb-0">
              <InputCom
                label={ServeLangItem()?.Name + "*"}
                placeholder={ServeLangItem()?.Name}
                type="text"
                name="name"
                inputClasses="h-[50px]"
                value={name}
                inputHandler={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <InputCom
                label={ServeLangItem()?.Email + "*"}
                placeholder={ServeLangItem()?.Email}
                type="email"
                name="email"
                inputClasses="h-[50px]"
                value={email}
                inputHandler={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full mb-[30px]">
            <h6 className="input-label text-qgray capitalize text-[13px] font-normal block mb-2 ">
              {ServeLangItem()?.Message}*
            </h6>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              name=""
              id=""
              cols="30"
              rows="3"
              className="w-full placeholder:text-sm focus:ring-0 focus:outline-none p-6"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              onClick={reviewAction}
              type="button"
              className="black-btn w-[300px] h-[50px]  flex justify-center"
            >
              <span className="flex space-x-1 items-center h-full">
                <span className="text-sm font-semibold">
                  {ServeLangItem()?.Submit_Review}
                </span>
                {reviewLoading && (
                  <span className="w-5 " style={{ transform: "scale(0.3)" }}>
                    <LoaderStyleOne />
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
      {commnets.length > 0 && (
        <div className="w-full comments">
          <div className="w-full h-[1px] bg-[#DCDCDC]"></div>
          <h1 className="text-2xl font-medium text-qblack my-5">
            {ServeLangItem()?.Comments}
          </h1>
          {commnets &&
            commnets.length > 0 &&
            commnets.map((comment) => (
              <>
                <div
                  key={comment.id + Math.random()}
                  className="comment-item bg-white px-10 py-[32px] mb-2.5"
                >
                  <div className="comment-author flex justify-between items-center mb-3">
                    <div className="flex space-x-3 rtl:space-x-reverse items-center">
                      <div className="w-[50px] h-[50px] rounded-full overflow-hidden relative">
                        <Image
                          layout="fill"
                          src={`/assets/images/comment-user-1.png`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[18px] font-medium text-qblack">
                          {comment.author}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="comment mb-[30px]">
                    <p className="text-[15px] text-qgray leading-7 text-normal">
                      {comment.comments}
                    </p>
                  </div>
                  {comment.replys &&
                    comment.replys.length > 0 &&
                    comment.replys.map((reply) => (
                      <div
                        key={reply.id}
                        className="sub-comment-item bg-white px-10 pt-[32px] border-t"
                      >
                        <div className="comment-author  mb-3">
                          <div className="flex space-x-3 rtl:space-x-reverse items-center">
                            <div className="w-[50px] h-[50px] rounded-full overflow-hidden relative">
                              <Image
                                layout="fill"
                                src={`/assets/images/comment-user-2.png`}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-[18px] font-medium text-qblack">
                                {reply.author}
                              </p>
                              {/*<p className="text-[13px] font-normal text-qgray">*/}
                              {/*  London,UK*/}
                              {/*</p>*/}
                            </div>
                          </div>
                        </div>
                        <div className="comment mb-[30px]">
                          <p className="text-[15px] text-qgray leading-7 text-normal">
                            {reply.comments}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ))}
        </div>
      )}
    </>
  );
}
