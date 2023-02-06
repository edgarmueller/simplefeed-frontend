import { Link } from "react-router-dom";
import { login } from "../lib/auth/api/auth";
import { SignInLogic } from "../lib/auth/components/SignInLogic";
import "./register-style.css"

export const SignIn = () => {
  return (
    <SignInLogic login={login}>
      {({
        canSubmit,
        handleSubmit,
        errors,
        isSubmitted,
        handleEmailUpdated,
        handlePasswordUpdated,
      }) => (
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
                {isSubmitted && <p>Sign up successful!</p>}
                <button type="submit" disabled={!canSubmit}>
                  Sign In
                </button>
                <br/>
                <Link to="/sign-up" className="sign-up">Need an account? Register here!</Link>
              </form>
            </div>
          </div>
      )}
    </SignInLogic>
  );
};
