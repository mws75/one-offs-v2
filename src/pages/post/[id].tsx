import { NextPage } from "next";
import { api } from "~/utils/api";

const SinglePagePost: NextPage<{ id: string }> = ({ id }) => {
  let num_id = Number(id);
  console.log(`[id] page: input is: ${id}`);

  const { data } = api.posts.getById.useQuery({
    id: num_id,
  });

  if (!data) return <div>{`404 and id: ${id}`}</div>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.post}</p>
    </div>
  );
};

export default SinglePagePost;
