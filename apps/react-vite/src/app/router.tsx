// react-query QueryClient type and hook to access the current client
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
// react-router v6.4+ data routers
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { paths } from '@/config/paths';
import { ProtectedRoute } from '@/lib/auth';

// Root app layout and its error boundary
import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from './routes/app/root';

// `convert` adapts the module shape exported by our route files into the
// shape expected by react-router's lazy route API. It allows route modules
// to export `clientLoader` and `clientAction` factory functions that receive
// the `QueryClient` so loaders/actions can use react-query.

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    // call clientLoader/clientAction with the QueryClient to create the
    // actual loader/action functions used by react-router for data loading
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

// createAppRouter builds the route tree. We keep it as a function that
// receives QueryClient so route modules can be initialized with it.
export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    // public landing page
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert(queryClient)),
    },
    // auth routes (register/login)
    {
      path: paths.auth.register.path,
      lazy: () => import('./routes/auth/register').then(convert(queryClient)),
    },
    {
      path: paths.auth.login.path,
      lazy: () => import('./routes/auth/login').then(convert(queryClient)),
    },
    // protected application area under /app
    {
      path: paths.app.root.path,
      // Wrap the app root with a ProtectedRoute that checks auth
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      // Use the AppRoot's ErrorBoundary for errors happening in its tree
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        // nested app routes (loaded lazily and converted)
        {
          path: paths.app.discussions.path,
          lazy: () =>
            import('./routes/app/discussions/discussions').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.discussion.path,
          lazy: () =>
            import('./routes/app/discussions/discussion').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.users.path,
          lazy: () => import('./routes/app/users').then(convert(queryClient)),
        },
        {
          path: paths.app.profile.path,
          lazy: () => import('./routes/app/profile').then(convert(queryClient)),
        },
        {
          path: paths.app.dashboard.path,
          lazy: () =>
            import('./routes/app/dashboard').then(convert(queryClient)),
        },
      ],
    },
    // fallback 404 route
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);

// AppRouter is a small wrapper that reads the QueryClient from context and
// creates the router. useMemo ensures the router is recreated only when the
// queryClient instance changes.
export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
