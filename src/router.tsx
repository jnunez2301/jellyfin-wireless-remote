import { Button } from "@chakra-ui/react";
import { createRootRoute, createRoute, createRouter, Link, Outlet } from "@tanstack/react-router";
import MediaByLibraryId from "./pages/libraryBySessionId/components/MediaByLibraryId";
import Home from "./pages/home/HomePage";
import LibraryBySessionIdPage from "./pages/libraryBySessionId/LibraryBySessionIdPage";
import LoginPage from "./pages/login/LoginPage";
import SessionPage from "./pages/session/SessionPage";
import SessionByIdPage from "./pages/sessionById/SessionByIdPage";
import Header from "./components/Header";

const rootRoute = createRootRoute({
  component: () => <Header><Outlet /></Header>,
  notFoundComponent: () => (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: "45vh", gap: '.3rem' }}>
    <p> 404 Whoops this route does not exist</p>
    <Link to='/'>
      <Button variant='subtle'>Go back to Home
      </Button>
    </Link>
  </div>)
})


const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Home />
})

const loginRouteByServerId = createRoute({
  getParentRoute: () => rootRoute,
  path: '/server/$serverAddress',
  component: () => <LoginPage />
});

const sessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/server/$serverAddress/sessions',
  component: () => <SessionPage />
})

const sessionByIdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/server/$serverAddress/sessions/$sessionId",
  component: () => <SessionByIdPage />
});

const libraryBySessionIdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/server/$serverAddress/sessions/$sessionId/library",
  component: () => <LibraryBySessionIdPage />
})

const episodesByLibraryIdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/server/$serverAddress/sessions/$sessionId/library/$libraryId/collectionType/$collectionType",
  component: () => <MediaByLibraryId />
})


const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRouteByServerId,
  sessionRoute,
  sessionByIdRoute,
  libraryBySessionIdRoute,
  episodesByLibraryIdRoute
])

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
export const router = createRouter({
  routeTree,
})

