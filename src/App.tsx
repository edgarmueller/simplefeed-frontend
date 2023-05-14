import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import { Layout } from "./components/Layout";
import { PostList } from "./components/posts/PostList";
import { SubmitForm } from "./components/SubmitForm";
import { UserDetail } from "./components/UserDetail";
import { Card, CardBody } from "@chakra-ui/react";

function App() {
  return (
    <Layout>
      <Container fluid>
        <Row>
          <Col sm={4}>
            <UserDetail />
          </Col>
          <Col sm={{ offset: 0 }}>
            <Card>
              <CardBody>
                <PostList />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default App;
