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
  availableSizes: string | string[]
  sizes?: string | string[]
  date: string
  region: string
  category: string
  reason: string | null
}

export const useData = () => {
  const hmUrl = import.meta.env.VITE_CARTERS_URL

  const [sortBy, setSortBy] = useState('salePercent')
  const [availableSizesFilter, setAvailableSizesFilter] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [regionFilter, setRegionFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [requestStatus, setRequestStatus] = useState<string | null>(null)
  // const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  useEffect(() => {
    fetchProducts()
  }, [])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    event.preventDefault()
    setCurrentPage(page)
  }

  const fetchProducts = () => {
    setIsLoading(true)
    axios
      .get(`${hmUrl}/hm/products`)
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

  const handleDelete = () => {
    setIsConfirmDeleteModalOpen(true)
  }

  const deleteProducts = () => {
    setDeleteStatus('Товари видаляються...')
    axios
      .delete(`${hmUrl}/hm/products`)
      .then(() => {
        fetchProducts()
      })
      .catch((error) => {
        console.error('There was an error deleting all products:', error)
      })

    setTimeout(() => {
      setDeleteStatus(null)
      setIsConfirmDeleteModalOpen(false)
    }, 7000)
  }

  const sortedFilteredProducts = useMemo(() => {
    // Filter by region
    const availableSizesFilterArray = !availableSizesFilter
      ? products
      : products.filter((product: any) => {
          if (product.availableSizes === null) return false
          const fewLeftSizes = product.availableSizes.filter(
            (size: string) =>
              product.availableSizes.includes('Few pieces left') ||
              size.includes('Zostało tylko kilka sztuk!')
          )
          return (
            product.availableSizes.length >= availableSizesFilter &&
            !(
              product.availableSizes.length === availableSizesFilter &&
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

    if (sortBy === 'dateAdding') {
      return categoryFilteredProducts.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB.getTime() - dateA.getTime() // Descending order of date
      })
    } else {
      return categoryFilteredProducts.sort((a, b) => {
        const salePercentA = a.salePercent
          ? parseInt(a.salePercent.replace('-', '').replace('%', ''), 10)
          : 0
        const salePercentB = b.salePercent
          ? parseInt(b.salePercent.replace('-', '').replace('%', ''), 10)
          : 0
        return salePercentB - salePercentA // Descending order of salePercent
      })
    }
  }, [products, regionFilter, categoryFilter, sortBy, availableSizesFilter])

  const requestScraping = () => {
    // setIsRequestModalOpen(false);
    fetch(`${hmUrl}/hm/run-scraper`, {
      method: 'POST'
    })
      .then((response) => {
        if (response.status === 200) {
          setRequestStatus('success')
          console.log(response.status)
        } else {
          console.log('Unexpected status code:', response.status)
        }
      })
      .catch((error) => {
        throw new Error(`There was an error starting scraping: ${error}`)
      })
  }

  const checkstatus = () => {
    fetch(`${hmUrl}/hm/run-scraper`, {
      method: 'POST',
      body: JSON.stringify({ onlychecking: true })
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
  }

  // Get the products for the current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedFilteredProducts.slice(startIndex, endIndex)
  }, [
    sortedFilteredProducts,
    currentPage,
    sortBy,
    categoryFilter,
    availableSizesFilter
  ])

  const totalPages = Math.ceil(sortedFilteredProducts.length / itemsPerPage)

  return {
    paginatedProducts,
    sortedFilteredProducts,
    regionFilter,
    setRegionFilter,
    isConfirmDeleteModalOpen,
    setIsConfirmDeleteModalOpen,
    categoryFilter,
    setCategoryFilter,
    deleteProducts,
    sortBy,
    setSortBy,
    availableSizesFilter,
    setAvailableSizesFilter,
    isLoading,
    requestScraping,
    checkstatus,
    requestStatus,
    // isRequestModalOpen,
    setRequestStatus,
    handleDelete,
    deleteStatus,
    handlePageChange,
    currentPage,
    setCurrentPage,
    totalPages
  }
}
