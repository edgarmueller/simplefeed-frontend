// import './wdyr';
import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Friends } from './components/Friends';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { AuthOutlet } from './lib/auth/components/AuthOutlet';
import Feed from './pages/Feed';
import UserProfile, { loader as userLoader } from './pages/UserProfile';
import reportWebVitals from './reportWebVitals';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import Search from './pages/Search';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthOutlet />}>
      <Route path='/feed' element={<ProtectedRoute><Feed/></ProtectedRoute>} />
      <Route path='/search' element={<ProtectedRoute><Search/></ProtectedRoute>} />
      <Route path='/settings' element={<ProtectedRoute><Settings/></ProtectedRoute>} />
      <Route path='/users/:username/chat' element={<ProtectedRoute><UserProfile/></ProtectedRoute>} loader={userLoader}/>
      <Route path='/users/:username' element={<ProtectedRoute><UserProfile/></ProtectedRoute>} loader={userLoader}/>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/friends' element={<ProtectedRoute><Friends /></ProtectedRoute>} />
      <Route path='/chat' element={<ProtectedRoute><Chat/></ProtectedRoute>} />
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
