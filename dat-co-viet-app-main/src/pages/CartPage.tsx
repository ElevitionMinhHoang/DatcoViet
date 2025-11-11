import { Layout } from "@/components/layout/Layout";

const CartPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Giỏ hàng</h1>
        <p className="mt-4">
          Đây là trang giỏ hàng.
        </p>
      </div>
    </Layout>
  );
};

export default CartPage;