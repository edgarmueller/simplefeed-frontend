import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { fetchProfile } from "./api/profile";
import "./App.css";
import { Layout } from "./components/Layout";
import { useAuth } from "./lib/auth/hooks/useAuth";

function App() {
  const { user, logout } = useAuth();
  const [bio, setBio] = useState();

  return (
    <Layout>
      Hi {user?.username}!
      {bio ? <p>{bio}</p> : <p>no bio</p>}
      <button onClick={logout}>
        Logout
      </button>
      <button onClick={() => fetchProfile(user?.username!).then(p => setBio(p.bio))}>
        fetch bio
      </button>
    </Layout>
  );
}

export default App;
