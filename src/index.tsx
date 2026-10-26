import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Toaster } from './components/ui/toaster';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthOutlet } from './components/auth/AuthOutlet';
import Feed from './pages/FeedPage';
import Settings from './pages/SettingsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import { SignUp } from './components/auth/SignUp';
import { SignIn } from './components/auth/SignIn';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ChannelsPage from './pages/ChannelsPage';
import ChannelPage from './pages/ChannelPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthOutlet />}>
      <Route path='*' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path='/saved' element={<ProtectedRoute><Feed saved /></ProtectedRoute>} />
      <Route path='/channels' element={<ProtectedRoute><ChannelsPage /></ProtectedRoute>} />
      <Route path='/channels/:channelId' element={<ProtectedRoute><ChannelPage /></ProtectedRoute>} />
      <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path='/sign-in' element={<SignIn />} />
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
