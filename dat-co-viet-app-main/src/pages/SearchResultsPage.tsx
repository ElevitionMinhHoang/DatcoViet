import { Layout } from "@/components/layout/Layout";
import { useSearchParams } from "react-router-dom";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Kết quả tìm kiếm cho "{query}"</h1>
        <p className="mt-4">
          Chức năng tìm kiếm đang được phát triển.
        </p>
      </div>
    </Layout>
  );
};

export default SearchResultsPage;
