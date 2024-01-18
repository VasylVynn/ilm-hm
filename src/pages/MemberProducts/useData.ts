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
    const [sortBy, setSortBy] = useState('salePercent');
    const [availableSizesFilter, setAvailableSizesFilter] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [regionFilter, setRegionFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

 

    useEffect(() => {
      fetchProducts();
    }, []);
  
    const fetchProducts = () => {
      axios.get('http://localhost:3000/api/memberSizes')
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the product data:', error);
        });
    };
  
    function deleteProduct(articleCode: string) {
        axios.delete(`http://localhost:3000/api/memberSizes/${articleCode}`)
            .then(() => {
                // Refresh the product list
                fetchProducts();
            })
            .catch(error => {
                console.error('There was an error deleting the product:', error);
            });
    }
  
    const deleteAllProducts = () => {
      axios.delete('http://localhost:3000/api/memberSizes')
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

      axios.delete(`http://localhost:3000/api/memberSizes/delete?region=${region}&category=${category}&reason=''}`)
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
        if (regionFilter === 'all' && categoryFilter === 'all') {
            deleteAllProducts();
        } else {
            // Delete filtered products
            deleteProducts();
        }
        setIsConfirmDeleteModalOpen(false);
    }

    const sortedFilteredProducts = useMemo(() => {


      const availableSizesFilterArray = !availableSizesFilter? products : products.filter((product: any) => {
        const sizes = JSON.parse(product.availableSizes);
        const fewLeftSizes = sizes.filter((size: string) => size.includes("Few pieces left") || size.includes("Zostało tylko kilka sztuk!"));
        return sizes.length >= availableSizesFilter &&  !(sizes.length === availableSizesFilter && fewLeftSizes.length === availableSizesFilter);
    });
        // Filter by region
        const regionFilteredProducts = regionFilter === 'all' 
            ? availableSizesFilterArray 
            : availableSizesFilterArray.filter(product => product.region.toLowerCase() === regionFilter.toLowerCase());

        

        // Further filter by category
        const categoryFilteredProducts = categoryFilter === 'all' 
            ? regionFilteredProducts 
            : regionFilteredProducts.filter(product => product.category === categoryFilter);    
            
            if (sortBy === 'dateAdding') {
                return categoryFilteredProducts.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB.getTime() - dateA.getTime(); // Descending order of date
                });
            } else{
                return categoryFilteredProducts.sort((a, b) => {
                    const salePercentA = parseInt(a.salePercent.replace('-', '').replace('%', ''), 10);
                    const salePercentB = parseInt(b.salePercent.replace('-', '').replace('%', ''), 10);
                    return salePercentB - salePercentA; // Descending order of salePercent
                });
            }

            
    }, [products, regionFilter, categoryFilter, sortBy, availableSizesFilter]);



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
    handleDelete,
    sortBy,
    setSortBy,
    availableSizesFilter,
    setAvailableSizesFilter
  };
};




