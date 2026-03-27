import HostForm from "@/pages/home/components/HostForm";
import ServerSelector from "@/pages/home/components/ServerSelector";

const Home = () => {
  return <div data-testid='Home'>
    <HostForm />
    <ServerSelector />
  </div>;
};

export default Home;
