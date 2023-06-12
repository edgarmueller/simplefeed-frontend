import { Container, Row } from "react-bootstrap";
import { Layout } from "../components/Layout";
import { UpdateUserForm } from "../components/user/UpdateUserForm";
import { useUser } from "../lib/auth/hooks/useUser";

function SettingsPage() {
  return (
    <Layout>
      <Container fluid>
        <Row>
          <UpdateUserForm />
        </Row>
      </Container>
    </Layout>
  );
}

export default SettingsPage