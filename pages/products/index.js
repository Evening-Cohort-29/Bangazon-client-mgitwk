import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Filter from "../../components/filter";
import Layout from "../../components/layout";
import Navbar from "../../components/navbar";
import { ProductCard } from "../../components/product/card";
import { getCategories, getProducts } from "../../data/products";

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading products...");
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    getCategories().then((categoriesData) => {
      if (categoriesData) {
        setCategories(categoriesData);
      }
    });
  }, []);

  useEffect(() => {
    getProducts()
      .then((data) => {
        if (data) {
          const locationData = [
            ...new Set(data.map((product) => product.location)),
          ];
          const locationObjects = locationData.map((location) => ({
            id: location,
            name: location,
          }));

          setProducts(data);
          setIsLoading(false);
          setLocations(locationObjects);
        }
      })
      .catch((err) => {
        setLoadingMessage(
          `Unable to retrieve products. Status code ${err.message} on response.`
        );
      });
  }, []);

  const searchProducts = (event) => {
    getProducts(event).then((productsData) => {
      if (productsData) {
        setProducts(productsData);
        setIsFiltered(true);
      }
    });
  };

  const resetFilter = () => {
    setIsFiltered(false);
    setIsLoading(true);

    getProducts()
      .then((data) => {
        if (data) {
          const locationData = [
            ...new Set(data.map((product) => product.location)),
          ];
          const locationObjects = locationData.map((location) => ({
            id: location,
            name: location,
          }));

          setProducts(data);
          setIsLoading(false);
          setLocations(locationObjects);
        }
      });
  };

  if (isLoading) return <p>{loadingMessage}</p>;

  return (
    <>
      <Filter
        productCount={products.length}
        onSearch={searchProducts}
        onReset={resetFilter}
        locations={locations}
      />

      {!isFiltered && categories.map((category) => {
        const categoryProducts = products.filter(product => product.category.id === category.id);

        return (
          <div key={category.id}>
            <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
              {category.name}
            </h1>
      {categoryProducts.length > 0 ? (
        categoryProducts.splice(0, 5).map(filteredProduct => (
          <>
          <ProductCard product={filteredProduct} key={filteredProduct.id} />
        </>
        ))
      ) : (
        <p style={{ fontSize: "18px", color: "#666", fontStyle: "italic" }}>
          No products available in this category
        </p>
      )}
    </div>
  );
})}

      {isFiltered && (
        <div className="columns is-multiline">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      )}
    </>
  );
}

Products.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  );
};
