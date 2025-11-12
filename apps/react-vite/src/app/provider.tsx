// react-query: QueryClient manages server state caching and synchronization
// QueryClientProvider: wraps the app to allow useQuery/useMutation hooks
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { AuthLoader } from '@/lib/auth';
// Default react-query options like retry count, stale time, etc.
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

// AppProvider wraps the entire app with multiple context providers. It is called
// from index.tsx's <App> component. The order of providers matters: innermost
// providers are closer to children, outermost are evaluated first.
export const AppProvider = ({ children }: AppProviderProps) => {
  // Create a single QueryClient instance and memoize it with useState + callback
  // This avoids recreating the client on every render, which would clear the cache
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    // ============ OUTERMOST LAYER: Suspense ============
    // React.Suspense with a fallback Spinner: shown while the app is loading
    // (e.g., during lazy imports of route modules)
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      {/* ============ LAYER 2: Error Boundary ============ */}
      {/* Catches any unhandled errors thrown in child components and displays
          MainErrorFallback UI instead of a white screen. This is the global
          error handler for the app. */}
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        {/* ============ LAYER 3: Helmet Provider ============ */}
        {/* Allows child components to manage the HTML <head> (title, meta tags)
            from anywhere in the component tree via the useHelmet hook. */}
        <HelmetProvider>
          {/* ============ LAYER 4: React Query Provider ============ */}
          {/* Provides the QueryClient context so useQuery/useMutation hooks can
              access the cache, fetch data, and manage server state. */}
          <QueryClientProvider client={queryClient}>
            {/* Show React Query Devtools panel only in development mode.
                Useful for inspecting queries, cache, and network requests. */}
            {import.meta.env.DEV && <ReactQueryDevtools />}

            {/* ============ GLOBAL NOTIFICATIONS ============ */}
            {/* Toast/notification container: components can trigger notifications
                via a hook throughout the app. */}
            <Notifications />

            {/* ============ LAYER 5: Auth Loader ============ */}
            {/* AuthLoader is a boundary component that:
                1. Checks if the user is logged in (e.g., validates JWT token)
                2. Shows a Spinner while auth status is being determined
                3. Only renders children after auth check completes
                4. Allows auth state to be set up before routing happens
            */}
            <AuthLoader
              renderLoading={() => (
                <div className="flex h-screen w-screen items-center justify-center">
                  <Spinner size="xl" />
                </div>
              )}
            >
              {/* ============ INNERMOST: APP CONTENT ============ */}
              {/* children here is the AppRouter (from index.tsx), which renders
                  the routing layer. By the time routing renders, auth is verified
                  and all providers are ready. */}
              {children}
            </AuthLoader>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
