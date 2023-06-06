// import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { FriendRequests } from './components/Friends';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthOutlet } from './lib/auth/components/AuthOutlet';
import Feed from './pages/Feed';
import { loader as userLoader } from './pages/UserProfile';
import UserProfile from './pages/UserProfile';
import { ChakraProvider } from '@chakra-ui/react';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthOutlet />}>
      <Route path='/feed' element={<ProtectedRoute><Feed/></ProtectedRoute>} />
      <Route path='/users/:username' element={<ProtectedRoute><UserProfile/></ProtectedRoute>} loader={userLoader}/>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/friends' element={<ProtectedRoute><FriendRequests /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/feed" replace /> } />
    </Route>
  )
)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
