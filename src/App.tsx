import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import { Layout } from "./components/Layout";
import { UserDetail } from "./components/UserDetail";

function App() {
  return (
    <Layout>
      <Container fluid>
        <Row>
          <Col sm={4} className="column">
            <UserDetail />
          </Col>
          <Col sm={{ offset: 1 }} className="column">
            newsfeed
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default App;
