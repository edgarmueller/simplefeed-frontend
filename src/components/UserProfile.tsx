import { useEffect, useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import { fetchUserProfile } from "../api/profile";
import { Profile, User } from "../domain.interface";
import { useUser } from "../lib/auth/hooks/useUser";
import { BefriendButton } from "./BefriendButton";
import { UserDetail } from "./UserDetail";
import { PostList } from "./posts/PostList";
import { Layout } from "./Layout";
import { Col, Container, Row } from "react-bootstrap";
import { Card, CardBody } from "@chakra-ui/react";

export async function loader({ params }: any): Promise<Profile | Response> {
  try {
    return await fetchUserProfile(params.username);
  } catch (error) {
    return redirect("/sign-in");
  }
}

export const UserProfile = () => {
  const { user: myself } = useUser();
  console.log({ myself });
  const user = useLoaderData() as User;
  const [isFriend, setIsFriend] = useState(false);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    console.log({ user });
    const isBefriended = !!myself?.friends?.find(({ id }) => id === user?.id);
    setIsFriend(isBefriended);
    setUserId(user?.id);
  }, [myself, setIsFriend, user]);
  console.log({ isFriend, userId: userId });
  return (
    <Layout>
      <Container fluid>
        <Row>
          <Col sm={4}>
            <UserDetail user={user} />
                {isFriend ? null : <BefriendButton username={user.username} />}
          </Col>
          <Col sm={{ offset: 0 }}>
            <Card>
              <CardBody>
                <PostList userId={userId} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
