import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import { Layout } from "./components/Layout";
import { PostList } from "./components/posts/PostList";
import { SubmitForm } from "./components/SubmitForm";
import { UserDetail } from "./components/UserDetail";

function App() {
  return (
    <Layout>
      <Container fluid>
        <Row>
          <Col sm={4} className="column">
            <UserDetail />
          </Col>
          <Col sm={{ offset: 0 }} className="column">
            <SubmitForm />
            <PostList />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default App;
