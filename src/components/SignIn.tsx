import jwtDecode from "jwt-decode";
import { Link, Navigate } from "react-router-dom";
import { User } from "../domain.interface";
import { login as loginApi } from "../lib/auth/api/auth";
import { SignInLogic } from "../lib/auth/components/SignInLogic";
import { useAuth } from "../lib/auth/hooks/useAuth";
import "./SignIn.css";

export const SignIn = () => {
  const { user, login: loginApp } = useAuth();
  const login = async (email: string, password: string) => {
    const user = await loginApi(email, password);
    loginApp(jwtDecode<User>(user.token))
  }
  if (user) {
    return (<Navigate replace to="/home" />)
  }
  return (
    <SignInLogic login={login}>
      {({
        canSubmit,
        handleSubmit,
        errors,
        isSubmitted,
        handleEmailUpdated,
        handlePasswordUpdated,
      }) => {
        return (
        <div className="wrapper">
          <div className="login_box">
            <div className="login_header">
              <h1>Swirlfeed</h1>
              Login or sign up below
            </div>
              <form id="login-form" onSubmit={handleSubmit}>
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  onChange={handleEmailUpdated}
                  required
                />
                <br />
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  onChange={handlePasswordUpdated}
                />
                <br />
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
                {isSubmitted && <p>Login successful!</p>}
                <input type="submit" disabled={!canSubmit} value="Sign In"/>
                <br/>
                <Link to="/sign-up" className="sign-up">Need an account? Register here!</Link>
              </form>
            </div>
          </div>
      )
      }
      }
    </SignInLogic>
  );
};
