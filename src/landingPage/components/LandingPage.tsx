import { useSelector } from "react-redux";
import { RootState } from "../../store/RootState";

export const LandingPage = (props: any) => {
  const directoryLoaded = useSelector((state: RootState) => state.dataLocation);
  if (!directoryLoaded) {
    return <div>Select a data directory</div>;
  }
  return <div key={JSON.stringify(directoryLoaded)}>{props.children}</div>;
};
