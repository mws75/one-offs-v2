import { useUser } from "@clerk/nextjs";

export const UserProfile = () => {
  const { user } = useUser()!;
  if (!user)
    return (
      <div>
        <p>401 Please Login</p>
      </div>
    );

  return (
    <>
      <p>{`Welcome ${user.emailAddresses}`}</p>
    </>
  );
};

export default UserProfile;
