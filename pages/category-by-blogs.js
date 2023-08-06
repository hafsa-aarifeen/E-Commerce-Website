import React from "react";
import Blogs from "../src/components/Blogs";

function categoryByBlogs({ data }) {
    return (
        <>
            <Blogs blogs={data.blogs.data} />
        </>
    );
}
export async function getServerSideProps(context) {
    // Fetch data from external API
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/blog?category=${context.query.category}`
    );
    const data = await res.json();
    return { props: { data } };
}
export default categoryByBlogs;
