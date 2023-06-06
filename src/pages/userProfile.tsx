import { useUser } from "@clerk/nextjs";
import { api } from "../utils/api";

// Custom Hooks
const useUserPosts = (user_name: string) => {
  const { data, isError, isLoading, error } = api.posts.getUserPosts.useQuery({
    user_name: user_name,
  });
  return { data, isError, isLoading, error };
};

export const UserProfile = () => {
  const { user } = useUser()!;

  if (!user)
    return (
      <div>
        <p>401 Please Login</p>
      </div>
    );

  const userPosts = useUserPosts(user.id);

  console.log(userPosts.data);

  return (
    <>
      <p>{`Welcome ${user.emailAddresses}`}</p>
      <p>{`${userPosts.data}`}</p>
    </>
  );
};

export default UserProfile;
