import Home from "../screens/Home";
import { loadPricing } from "../Utility/workspacePricing";

export async function getStaticProps() {
  const pricing = await loadPricing();
  // Hourly refresh keeps list prices current; retry sooner when Workspace couldn't be reached.
  return { props: { pricing }, revalidate: pricing ? 3600 : 300 };
}

export default Home;
