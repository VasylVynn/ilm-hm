import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'

export interface Product {
  name: string
  articleCode: string
  salePercent: string
  link: string
  imageLink: string
  priceSale: string | null
  priceRegular: string
  availableSizes: string
  date: string
  region: string
  category: string
  reason: string | null
}

export const useData = () => {
  const cartersUrl = import.meta.env.VITE_CARTERS_URL
  const [sortBy, setSortBy] = useState('salePercent')
  const [availableSizesFilter, setAvailableSizesFilter] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [regionFilter, setRegionFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [reasonFilter, setReasonFilter] = useState('all')
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    setIsLoading(true)
    axios
      .get(`${cartersUrl}/ca/products`)
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.error('There was an error fetching the product data:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function deleteProduct(articleCode: string) {
    axios
      .delete(`https://ca.wizz-app.net/api/sizes/${articleCode}`)
      .then(() => {
        // Refresh the product list
        fetchProducts()
      })
      .catch((error) => {
        console.error('There was an error deleting the product:', error)
      })
  }

  const deleteAllProducts = () => {
    axios
      .delete('https://ca.wizz-app.net/api/sizes')
      .then(() => {
        // Refresh the product list
        fetchProducts()
      })
      .catch((error) => {
        console.error('There was an error deleting all products:', error)
      })
  }

  const deleteProducts = () => {
    setIsDeleting(true)
    axios
      .delete(`${cartersUrl}/ca/products`)
      .then(() => {
        fetchProducts()
      })
      .catch((error) => {
        console.error('There was an error deleting all products:', error)
      })
      .finally(() => {
        setIsDeleting(false)
        setIsConfirmDeleteModalOpen(false)
        fetchProducts()
      })
  }

  const requestScraping = () => {
    setIsRequesting(true)
    fetch(`${cartersUrl}/ca/run-scraper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `{"onlychecking":false}`
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.status)
        } else {
          console.log('Unexpected status code:', response.status)
        }
      })
      .catch((error) => {
        throw new Error(`There was an error starting scraping: ${error}`)
      })
      .finally(() => {
        fetchProducts()
        setIsRequesting(false)
        setIsRequestModalOpen(false)
      })
  }

  const handleDelete = () => {
    // Delete all products
    if (
      regionFilter === 'all' &&
      categoryFilter === 'all' &&
      reasonFilter === 'all'
    ) {
      deleteAllProducts()
    } else {
      // Delete filtered products
      deleteProducts()
    }
    setIsConfirmDeleteModalOpen(false)
  }

  const sortedFilteredProducts = useMemo(() => {
    // Filter by region
    const availableSizesFilterArray = !availableSizesFilter
      ? products
      : products.filter((product: any) => {
          const sizes = product.availableSizes
          const fewLeftSizes = sizes.filter(
            (size: string) =>
              size.includes('Few pieces left') ||
              size.includes('Zostało tylko kilka sztuk!')
          )
          return (
            sizes.length >= availableSizesFilter &&
            !(
              sizes.length === availableSizesFilter &&
              fewLeftSizes.length === availableSizesFilter
            )
          )
        })

    const regionFilteredProducts =
      regionFilter === 'all'
        ? availableSizesFilterArray
        : availableSizesFilterArray.filter(
            (product) =>
              product.region.toLowerCase() === regionFilter.toLowerCase()
          )

    // Further filter by category
    const categoryFilteredProducts =
      categoryFilter === 'all'
        ? regionFilteredProducts
        : regionFilteredProducts.filter(
            (product) => product.category === categoryFilter
          )

    // Further filter by reason
    const reasonFilteredProducts =
      reasonFilter === 'all'
        ? categoryFilteredProducts
        : categoryFilteredProducts.filter(
            (product) => product.reason === reasonFilter
          )

    if (sortBy === 'dateAdding') {
      return reasonFilteredProducts.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB.getTime() - dateA.getTime() // Descending order of date
      })
    } else {
      return reasonFilteredProducts.sort((a, b) => {
        const salePercentA = a.salePercent
          ? parseInt(a.salePercent.replace('-', '').replace('%', ''), 10)
          : 0
        const salePercentB = b.salePercent
          ? parseInt(b.salePercent.replace('-', '').replace('%', ''), 10)
          : 0
        return salePercentB - salePercentA // Descending order of salePercent
      })
    }
  }, [
    products,
    regionFilter,
    categoryFilter,
    reasonFilter,
    sortBy,
    availableSizesFilter
  ])

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
    handleDelete,
    sortBy,
    setSortBy,
    availableSizesFilter,
    setAvailableSizesFilter,
    isLoading,
    isRequestModalOpen,
    setIsRequestModalOpen,
    requestScraping,
    isDeleting,
    isRequesting
  }
}
