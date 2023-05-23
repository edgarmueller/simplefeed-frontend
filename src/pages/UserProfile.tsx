import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import { fetchUserProfile } from "../api/profile";
import { Profile, User } from "../domain.interface";
import { useUser } from "../lib/auth/hooks/useUser";
import { Layout } from "../components/Layout";
import { UserDetail } from "../components/UserDetail";
import { PostList } from "../components/posts/PostList";

export async function loader({ params }: any): Promise<Profile | Response> {
  try {
    return await fetchUserProfile(params.username);
  } catch (error) {
    return redirect("/sign-in");
  }
}

export const UserProfile = () => {
  const { user: myself } = useUser();
  const user = useLoaderData() as User;
  const [isFriend, setIsFriend] = useState(false);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    console.log({ user });
    const isBefriended = !!myself?.friends?.find(({ id }) => id === user?.id);
    setIsFriend(isBefriended);
    setUserId(user?.id);
  }, [myself, setIsFriend, user]);
  return (
    <Layout>
      <UserDetail user={user} isFriend={isFriend}/>
      <Tabs variant="soft-rounded" marginTop={4} colorScheme="blackAlpha">
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Friends</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
              <PostList userId={userId} />
          </TabPanel>
          <TabPanel>
              {/*<Friends userId={userId} />*/}
              {user.friends.length === 0
                  ? "No friends"
                  : user.friends.map((friend) => (
                      <UserDetail key={friend.id} user={friend} small />
                    ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};
