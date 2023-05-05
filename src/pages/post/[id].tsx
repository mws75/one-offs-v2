import { NextPage } from "next";
import { api } from "~/utils/api";

const SinglePagePost: NextPage<{ id: number }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({ id });

  if (!data) return <div>404</div>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.post}</p>
    </div>
  );
};

export default SinglePagePost;
