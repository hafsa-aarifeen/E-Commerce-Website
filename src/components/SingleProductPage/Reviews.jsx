import Image from "next/image";
import Star from "../Helpers/icons/Star";
// import InputCom from "../Helpers/InputCom";
// import LoaderStyleOne from "../Helpers/Loaders/LoaderStyleOne";
// import StarRating from "../Helpers/StarRating";
export default function Reviews({ comments }) {
  return (
    <div className="review-wrapper w-full">
      <div className="w-full reviews mb-[60px]">
        {/* comments */}
        <div className="w-full comments mb-[60px]">
          {comments &&
            comments.length > 0 &&
            comments.map((comment) => (
              <div
                key={comment.id}
                className="comment-item bg-white px-10 py-[32px] mb-2.5"
              >
                <div className="comment-author flex justify-between items-center mb-3">
                  <div className="flex space-x-3 items-center">
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden relative">
                      <Image
                        layout="fill"
                        src={
                          comment.image
                            ? comment.image
                            : `/assets/images/comment-user-1.png`
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[18px] font-medium text-qblack">
                        {comment.author}
                      </p>
                      {/*<p className="text-[13px] font-normal text-qgray">*/}
                      {/*  London,UK*/}
                      {/*</p>*/}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {Array.from(Array(comment.review), () => (
                        <span key={comment.review + Math.random()}>
                          <Star />
                        </span>
                      ))}
                      {comment.review < 5 && (
                        <>
                          {Array.from(Array(5 - comment.review), () => (
                            <span
                              key={comment.review + Math.random()}
                              className="text-gray-500"
                            >
                              <Star defaultValue={false} />
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                    <span className="text-[13px] font-normal text-qblack mt-1 inline-block">
                      ({comment.review}.0)
                    </span>
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
                        <div className="flex space-x-3 items-center">
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
            ))}
        </div>
        {/* load comments */}
        {/*<div className="w-full flex justify-center">*/}
        {/*  <button*/}
        {/*    type="button"*/}
        {/*    className="black-btn w-[300px] h-[50px] text-sm font-semibold"*/}
        {/*  >*/}
        {/*    Load More*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
