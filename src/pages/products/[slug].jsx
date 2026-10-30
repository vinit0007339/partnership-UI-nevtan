import Product from "../../screens/Product";
import { PRODUCT_SLUGS } from "../../constant/productPages";

export async function getStaticPaths() {
  return { paths: PRODUCT_SLUGS.map((slug) => ({ params: { slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}

export default Product;
