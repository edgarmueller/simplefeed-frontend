import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Toaster } from './components/ui/toaster';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthOutlet } from './components/auth/AuthOutlet';
import Feed from './pages/FeedPage';
import UserProfile, { loader as userLoader } from './pages/UserProfilePage';
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
import ChannelsPage from './pages/ChannelsPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthOutlet />}>
      <Route path='*' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path='/search' element={<ProtectedRoute><Search /></ProtectedRoute>} />
      <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path='/users/:username/chat' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} loader={userLoader} />
      <Route path='/users/:username' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} loader={userLoader} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/channels' element={<ProtectedRoute><ChannelsPage /></ProtectedRoute>} />
      <Route path='/chat' element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path='/notifications' element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path='/posts/:postId' element={<ProtectedRoute><Post /></ProtectedRoute>} loader={postLoader} errorElement={<>An error occurred while loading the post</>} />
    </Route>
  )
)

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider value={defaultSystem}>
      <RouterProvider router={router} />
      <Toaster />
    </ChakraProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
