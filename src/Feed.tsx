import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import { Layout } from "./components/Layout";
import { Feed } from "./components/posts/Feed";
import { UserDetail } from "./components/UserDetail";
import { Button, Card, CardBody, Icon, Stack } from "@chakra-ui/react";
import { useUser } from "./lib/auth/hooks/useUser";
import { FiUsers } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

function App() {
  const { user } = useUser()
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

export default App;
