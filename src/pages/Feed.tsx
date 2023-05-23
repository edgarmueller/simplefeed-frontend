import { Container, Row } from "react-bootstrap";
import { Layout } from "../components/Layout";
import { Feed } from "../components/posts/Feed";

function FeedPage() {
  return (
    <Layout>
      <Container fluid>
        <Row>
          <Feed />
        </Row>
      </Container>
    </Layout>
  );
}

export default FeedPage