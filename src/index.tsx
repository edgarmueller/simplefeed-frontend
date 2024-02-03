// import './wdyr';
import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthOutlet } from './components/auth/AuthOutlet';
import Feed from './pages/FeedPage';
import UserProfile, { loader as userLoader } from './pages/UserProfilePage';
import reportWebVitals from './reportWebVitals';
import Settings from './pages/SettingsPage';
import Chat from './pages/ChatPage';
import Search from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import Post, { loader as postLoader } from './pages/PostPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import { SignUp } from './components/auth/SignUp';
import { SignIn } from './components/auth/SignIn';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FriendsPage } from './pages/FriendsPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthOutlet />}>
      <Route path='*' element={<ProtectedRoute><Feed/></ProtectedRoute>} />
      <Route path='/feed' element={<ProtectedRoute><Feed/></ProtectedRoute>} />
      <Route path='/search' element={<ProtectedRoute><Search/></ProtectedRoute>} />
      <Route path='/settings' element={<ProtectedRoute><Settings/></ProtectedRoute>} />
      <Route path='/users/:username/chat' element={<ProtectedRoute><UserProfile/></ProtectedRoute>} loader={userLoader}/>
      <Route path='/users/:username' element={<ProtectedRoute><UserProfile/></ProtectedRoute>} loader={userLoader}/>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/friends' element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
      <Route path='/chat' element={<ProtectedRoute><Chat/></ProtectedRoute>} />
      <Route path='/notifications' element={<ProtectedRoute><NotificationsPage/></ProtectedRoute>} />
      <Route path='/posts/:postId' element={<ProtectedRoute><Post/></ProtectedRoute>} loader={postLoader} />
    </Route>
  )
)

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
