import axios from 'axios'
import { useEffect, useState } from 'react'

export interface Product {
  name: string
  articleCode: string
  salePercent: string
  link: string
  imageLink: string
  priceSale: string | null
  priceRegular: string
  availableSizes: string[]
  date: string
  region: string
  category: string
  reason: string | null
  isClearance?: boolean
}

export const useData = () => {
  const cartersUrl = import.meta.env.VITE_CARTERS_URL
  const [sortField, setSortField] = useState('salePercent')
  const [sortOrder, setSortOrder] = useState(-1)
  // const [availableSizesFilter, setAvailableSizesFilter] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  useEffect(() => {
    fetchProducts()
  }, [currentPage, sortField, sortOrder])

  const fetchProducts = () => {
    setIsLoading(true)
    const offset = (currentPage - 1) * itemsPerPage

    axios
      .get(`${cartersUrl}/smyk/products`, {
        params: {
          limit: itemsPerPage,
          offset,
          sort: sortField,
          order: sortOrder
        }
      })
      .then((response) => {
        const { products, total } = response.data
        setProducts(products || [])
        setTotalProducts(total || 0)
      })
      .catch((error) => {
        console.error('There was an error fetching the product data:', error)
        setProducts([])
        setTotalProducts(0)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const deleteProducts = () => {
    axios
      .delete(`${cartersUrl}/smyk/products`)
      .then(() => {
        fetchProducts()
      })
      .catch((error) => {
        console.error('There was an error deleting all products:', error)
      })
  }

  const handleDelete = () => {
    deleteProducts()
    setIsConfirmDeleteModalOpen(false)
  }

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 1 ? -1 : 1)
    } else {
      setSortField(field)
      setSortOrder(-1)
    }
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    event.preventDefault()
    setCurrentPage(page)
  }

  return {
    handleDelete,
    products,
    isConfirmDeleteModalOpen,
    setIsConfirmDeleteModalOpen,
    sortField,
    sortOrder,
    handleSortChange,
    // availableSizesFilter,
    // setAvailableSizesFilter,
    isLoading,
    currentPage,
    totalPages,
    totalProducts,
    handlePageChange
  }
}
