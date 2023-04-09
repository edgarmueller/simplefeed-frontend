// import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { NoMatch } from './NoMatch';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthOutlet } from './lib/auth/components/AuthOutlet';
import { loader as userLoader, UserProfile } from './components/UserProfile';
import { ChakraProvider } from '@chakra-ui/react';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthOutlet />}>
      <Route path='/home' element={<ProtectedRoute><App/></ProtectedRoute>} />
      <Route path='/:username' element={<ProtectedRoute><UserProfile/></ProtectedRoute>} loader={userLoader}/>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path="*" element={<NoMatch /> } />
    </Route>
  )
)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
