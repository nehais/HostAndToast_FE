import { useParams } from "react-router-dom";

const CookOverviewPage = () => {
  const { cookId } = useParams();
  return <div>CookOverviewPage</div>;
};
export default CookOverviewPage;
