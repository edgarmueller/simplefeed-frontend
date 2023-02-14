import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEnvelope,
  faCog,
  faBell,
  faUsers,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";

import "./NavBar.css";
import { useAuth } from "../lib/auth/hooks/useAuth";

export const NavBar = () => {
  const { user, logout } = useAuth();
  return (
    <>
      <div className="top_bar">
        <div className="logo">
          <a href="/">Swirlfeed</a>
        </div>
        <nav>
          <a href="/me" aria-label="home">
            {user?.username}
          </a>
          <a href="/home" aria-label="home">
            <FontAwesomeIcon icon={faHome} />
          </a>
          <a href="/messages" aria-label="messages">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="/notifications" aria-label="notififcations">
            <FontAwesomeIcon icon={faBell} />
          </a>
          <a href="/users" aria-label="users">
            <FontAwesomeIcon icon={faUsers} />
          </a>
          <a href="/settings" aria-label="settings">
            <FontAwesomeIcon icon={faCog} />
          </a>
          <a role="button" href="#" onClick={logout} aria-label="logout">
            <FontAwesomeIcon icon={faDoorOpen} />
          </a>
        </nav>
      </div>
    </>
  );
};
