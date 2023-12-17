import axios from "axios";
import {  useEffect, useMemo, useState } from "react";

export interface Product {
    name: string;
    articleCode: string;
    salePercent: string;
    link: string;
    imageLink: string;
    priceSale: string| null;
    priceRegular: string;
    availableSizes: string;
    date: string;
    region: string;
    category: string;
    reason: string |null;
}

export const useData = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [regionFilter, setRegionFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [reasonFilter, setReasonFilter] = useState('all');
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
 // Filter products based on region


 

    useEffect(() => {
      fetchProducts();
    }, []);
  
    const fetchProducts = () => {
      axios.get('https://wizz-app.net/api/sizes')
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the product data:', error);
        });
    };
  
    function deleteProduct(articleCode: string) {
        axios.delete(`https://wizz-app.net/api/sizes/${articleCode}`)
            .then(() => {
                // Refresh the product list
                fetchProducts();
            })
            .catch(error => {
                console.error('There was an error deleting the product:', error);
            });
    }
  
    const deleteAllProducts = () => {
      axios.delete('https://wizz-app.net/api/sizes')
        .then(() => {
          // Refresh the product list
          fetchProducts();
        })
        .catch(error => {
          console.error('There was an error deleting all products:', error);
        });
    };

    const deleteProducts = () => {
        const region = regionFilter === 'all' ? '' : regionFilter;
        const category = categoryFilter === 'all' ? '' : categoryFilter;
        const reason = reasonFilter === 'all' ? '' : reasonFilter;

      axios.delete(`https://wizz-app.net/api/sizes/delete?region=${region}&category=${category}&reason=${reason}`)
        .then(() => {
          // Refresh the product list
          fetchProducts();
        })
        .catch(error => {
          console.error('There was an error deleting all products:', error);
        });
    };


    const handleDelete = () => {
        // Delete all products
        if (regionFilter === 'all' && categoryFilter === 'all' && reasonFilter === 'all') {
            deleteAllProducts();
        } else {
            // Delete filtered products
            deleteProducts();
        }
        setIsConfirmDeleteModalOpen(false);
    }


    const sortedFilteredProducts = useMemo(() => {
        // Filter by region
        const regionFilteredProducts = regionFilter === 'all' 
            ? products 
            : products.filter(product => product.region.toLowerCase() === regionFilter.toLowerCase());

        // Further filter by category
        const categoryFilteredProducts = categoryFilter === 'all' 
            ? regionFilteredProducts 
            : regionFilteredProducts.filter(product => product.category === categoryFilter);

        // Further filter by reason
        const reasonFilteredProducts = reasonFilter === 'all' 
            ? categoryFilteredProducts 
            : categoryFilteredProducts.filter(product => product.reason === reasonFilter);

        // Sort the final filtered list (example: sort by salePercent)
        return reasonFilteredProducts.sort((a, b) => {
            const salePercentA = parseInt(a.salePercent.replace('-', '').replace('%', ''), 10);
            const salePercentB = parseInt(b.salePercent.replace('-', '').replace('%', ''), 10);
            return salePercentB - salePercentA; // Descending order of salePercent
        });
    }, [products, regionFilter, categoryFilter, reasonFilter]);



  return {
    deleteProduct,
    deleteAllProducts,
    deleteProducts,
    products,
    sortedFilteredProducts,
    regionFilter,
    setRegionFilter,
    isConfirmDeleteModalOpen,
    setIsConfirmDeleteModalOpen,
    categoryFilter,
    setCategoryFilter,
    reasonFilter,
    setReasonFilter,
    handleDelete
  };
};




