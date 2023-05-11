import { NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

const SinglePagePost = () => {
  const router = useRouter();
  const { id } = router.query;
  let num_id = Number(id);
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
