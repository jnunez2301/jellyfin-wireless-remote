import { Button } from "@chakra-ui/react";
import { createRootRoute, createRoute, createRouter, Link, Outlet } from "@tanstack/react-router";
import JellyfinHeader from "./components/jellyfin-wireless-remote/JellyfinHeader";
import JellyfinHostForm from "./components/jellyfin-wireless-remote/JellyfinHostForm";
import JellyfinLibrary from "./components/jellyfin-wireless-remote/JellyfinLibrary";
import JellyfinMediaByLibraryId from "./components/jellyfin-wireless-remote/JellyfinMediaByLibraryId";
import JellyfinRemoteControl from "./components/jellyfin-wireless-remote/JellyfinRemoteControl";
import JellyfinServerSelector from "./components/jellyfin-wireless-remote/JellyfinServerSelector";
import JellyfinSessionSelector from "./components/jellyfin-wireless-remote/JellyfinSessionSelector";
import JellyfinUserLoginForm from "./components/jellyfin-wireless-remote/JellyfinUserLoginForm";

const rootRoute = createRootRoute({
  component: () => <JellyfinHeader><Outlet /></JellyfinHeader>,
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
  component: () => <>
    <JellyfinHostForm />
    <JellyfinServerSelector />
  </>
})

const loginRouteByServerId = createRoute({
  getParentRoute: () => rootRoute,
  path: '/server/$serverAddress',
  component: () => <JellyfinUserLoginForm />
});

const sessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/server/$serverAddress/sessions',
  component: () => <JellyfinSessionSelector />
})

const sessionByIdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/server/$serverAddress/sessions/$sessionId",
  component: () => <JellyfinRemoteControl />
});

const libraryBySessionIdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/server/$serverAddress/sessions/$sessionId/library",
  component: () => <JellyfinLibrary />
})

const espidodesByLibraryIdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/server/$serverAddress/sessions/$sessionId/library/$libraryId/collectionType/$collectionType",
  component: () => <JellyfinMediaByLibraryId />
})


const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRouteByServerId,
  sessionRoute,
  sessionByIdRoute,
  libraryBySessionIdRoute,
  espidodesByLibraryIdRoute
])

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
export const router = createRouter({
  routeTree,
})

