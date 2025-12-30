import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router"
import App from "./App"
import JellyfinHostForm from "./pages/login/components/jellyfin-host-form/JellyfinHostForm"
import JellyfinServerSelector from "./pages/login/components/jellyfin-server-selector/JellyfinServerSelector"
import JellyfinUserLoginForm from "./pages/login/components/jellyfin-user-login-form/JellyfinUserLoginForm"
import JellyfinSessionSelector from "./pages/login/components/jellyfin-session-selector/JellyfinSessionSelector"
import JellyfinRemoteControl from "./pages/login/components/jellyfin-remote-control/JellyfinRemoteControl"

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => (<p> 404 Whoops this route does not exist</p>)
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <App />
})

const loginHostRoute = createRoute({
  getParentRoute: () => indexRoute,
  path: '/server',
  component: () => <>
    <JellyfinHostForm />
    <JellyfinServerSelector />
  </>
})

const loginRouteByServerId = createRoute({
  getParentRoute: () => indexRoute,
  path: '/server/$serverAddress',
  component: () => <JellyfinUserLoginForm />
});

const sessionRoute = createRoute({
  getParentRoute: () => indexRoute,
  path: '/server/$serverAddress/sessions',
  component: () => <JellyfinSessionSelector />
})

const sessionByIdRoute = createRoute({
  getParentRoute: () => indexRoute,
  path: "/server/$serverAddress/sessions/$serverId",
  component: () => <JellyfinRemoteControl />
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginHostRoute,
  loginRouteByServerId,
  sessionRoute,
  sessionByIdRoute
])

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
export const router = createRouter({
  routeTree,
})

