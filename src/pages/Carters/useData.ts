import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export interface Product {
  name: string;
  articleCode: string;
  salePercent: string;
  link: string;
  imageLink: string;
  priceSale: string | null;
  priceRegular: string;
  availableSizes: string[];
  date: string;
  region: string;
  category: string;
  reason: string | null;
  isClearance?: boolean;
}

export const useData = () => {
  const cartersUrl = import.meta.env.VITE_CARTERS_URL
  const [sortBy, setSortBy] = useState('salePercent');
  const [type, setType] = useState('all');
  const [availableSizesFilter, setAvailableSizesFilter] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // Number of items per page

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setIsLoading(true);
    axios.get(`${cartersUrl}/carters/products`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the product data:', error);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const deleteProducts = () => {

    axios.delete(`${cartersUrl}/carters/products`)
      .then(() => {
        fetchProducts();
      })
      .catch(error => {
        console.error('There was an error deleting all products:', error);
      });
  };

  const handleDelete = () => {
    deleteProducts();
    setIsConfirmDeleteModalOpen(false);
  }

  const sortedFilteredProducts = useMemo(() => {
    const typeFilteredProducts = type === 'all'
      ? products
      : type === 'sale'
        ? products.filter(product => !product.isClearance)
        : products.filter(product => product.isClearance);

    // Filter by available sizes
    const availableSizesFilterArray = !availableSizesFilter
      ? typeFilteredProducts
      : typeFilteredProducts.filter((product: any) => {
        if (product.availableSizes === null) return false;
        const fewLeftSizes = product.availableSizes.filter(
          (size: string) =>
            product.availableSizes.includes("Few pieces left") ||
            size.includes("Zostało tylko kilka sztuk!")
        );
        return (
          product.availableSizes.length >= availableSizesFilter &&
          !(product.availableSizes.length === availableSizesFilter &&
            fewLeftSizes.length === availableSizesFilter)
        );
      });

    // Further filter by category
    const categoryFilteredProducts = categoryFilter === 'all'
      ? availableSizesFilterArray
      : availableSizesFilterArray.filter(product => product.category === categoryFilter);

    if (sortBy === 'dateAdding') {
      return categoryFilteredProducts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime(); // Descending order of date
      });
    } else {
      return categoryFilteredProducts.sort((a, b) => {
        const salePercentA = a.salePercent ? parseInt(a.salePercent.replace('-', '').replace('%', ''), 10) : 0;
        const salePercentB = b.salePercent ? parseInt(b.salePercent.replace('-', '').replace('%', ''), 10) : 0;
        return salePercentB - salePercentA; // Descending order of salePercent
      });
    }
  }, [products, categoryFilter, sortBy, availableSizesFilter, type]);


  // Get the products for the current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedFilteredProducts.slice(startIndex, endIndex);
  }, [sortedFilteredProducts, currentPage, sortBy, categoryFilter, availableSizesFilter]);

  const totalPages = Math.ceil(sortedFilteredProducts.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    event.preventDefault();
    setCurrentPage(page);
  };


  return {
    handleDelete,
    products,
    sortedFilteredProducts,
    paginatedProducts,
    isConfirmDeleteModalOpen,
    setIsConfirmDeleteModalOpen,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    availableSizesFilter,
    setAvailableSizesFilter,
    isLoading,
    currentPage,
    totalPages,
    handlePageChange,
    type,
    setType
  };
};