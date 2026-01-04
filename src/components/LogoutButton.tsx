import { LocalSession } from "@/models/LocalSession";
import { UserSession } from "@/models/UserSession";
import { IconButton } from "@chakra-ui/react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { LuDoorOpen } from "react-icons/lu";

const LogoutButton = () => {
  const path = useLocation();
  const userSession = new UserSession(new LocalSession());
  const navigate = useNavigate();
  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      userSession.clearSession();
      navigate({ to: '/' })
    }
  };
  return <IconButton hidden={path.href === '/' || !userSession.getSession()} onClick={logout} variant='ghost' data-testid='LogoutButton'><LuDoorOpen /> Logout</IconButton>;
};

export default LogoutButton;
