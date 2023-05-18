import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import { Layout } from "./components/Layout";
import { Feed } from "./components/posts/Feed";
import { UserDetail } from "./components/UserDetail";
import { Card, CardBody } from "@chakra-ui/react";
import { useUser } from "./lib/auth/hooks/useUser";

function App() {
  const { user } = useUser()
  return (
    <Layout>
      <Container fluid>
        <Row>
          <Col sm={4}>
            <UserDetail user={user} />
          </Col>
          <Col sm={{ offset: 0 }}>
            <Card>
              <CardBody>
                <Feed />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default App;
