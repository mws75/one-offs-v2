import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import PostObject from "~/components/postobject";
import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "./loadingspinner";

const PostFeed = () => {
  const { user } = useUser();
  if (!user) return null;

  const userId = user.id;
  const profile_image_url = user.profileImageUrl;

  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  const user_profile = api.profile.getById.useQuery({ id: userId });
  const { mutate } = api.profile.insertNewUser.useMutation({});
  const [dataFeteched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user_profile.data === undefined) {
        try {
          await mutate({ profile_image_url });
          setDataFetched(true);
        } catch (error) {
          console.log(error);
          alert("something went wrong");
        }
      } else {
        console.log("user has already been added");
      }
    };
    if (!dataFeteched) {
      fetchData();
    }
  }, []);

  if (postsLoading) {
    return <LoadingPage />;
  }
  if (!data) {
    return <p>No posts found</p>;
  }

  return (
    <div className="m-2 flex flex-wrap">
      {data.map((post) => (
        <div key={post.id} className="mx-1 p-2">
          <PostObject {...post} key={post.id} />
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
