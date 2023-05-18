import { Link, Navigate } from "react-router-dom";
import { register } from "../lib/auth/api/auth";
import { SignUpLogic } from "../lib/auth/components/SignUpLogic";
import { useAuth } from "../lib/auth/hooks/useAuth";
import "./SignUp.css"

export const SignUp = () => {
  const { token } = useAuth()
  if (token) return <Navigate to="/" />
  return (
    <SignUpLogic register={register}>
      {({
        canSubmit,
        handleSubmit,
        errors,
        isSubmitted,
        handleEmailUpdated,
        handleSignUpInfoUpdated,
        handlePasswordUpdated,
        handlePasswordConfirmUpdated,
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
                id="username"
                type="text"
                placeholder="Username"
                onChange={handleSignUpInfoUpdated('username')}
                required
              />
              <br />
              <input
                id="firstName"
                type="text"
                placeholder="First name"
                onChange={handleSignUpInfoUpdated('firstName')}
                required
              />
              <br />
              <input
                id="lastName"
                type="text"
                placeholder="Last name"
                onChange={handleSignUpInfoUpdated('lastName')}
                required
              />
              <br />
              <input
                id="imageUrl"
                type="text"
                placeholder="Image "
                onChange={handleSignUpInfoUpdated('imageUrl')}
                required
              />
              <input
                id="password"
                type="password"
                placeholder="Password"
                onChange={handlePasswordUpdated}
              />
              <br />
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                onChange={handlePasswordConfirmUpdated}
              />
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
              {isSubmitted && <>
                <p>Sign up successful!</p>
                <Link to="/sign-in" className="sign-up">Login here!</Link>
                </>
              }
              <br/>
              <input type="submit" disabled={!canSubmit} value="Sign Up"/>
              <br/>
              <Link to="/sign-in" className="sign-up">Already have an account? Sign in here!</Link>
            </form>
          </div>
        </div>
      )}
    </SignUpLogic>
  );
};
