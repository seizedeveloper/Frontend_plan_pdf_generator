import { useEffect, useState, useRef } from 'react'
import { Product } from '../types'
import ProductCard from './ProductCard'
import { Search, List, LayoutGrid } from 'lucide-react'
import { Base_url } from '@/api'

interface ProductSelectionProps {
  selectedProducts: Product[]
  onProductsChange: (products: Product[]) => void
}

const ProductSelection = ({
  selectedProducts,
  onProductsChange,
}: ProductSelectionProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const lastLoadedSheetRef = useRef<string | null>(null)

  // Fetch sheet names initially
  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const response = await fetch(`${Base_url}excel-data/`)
        const result = await response.json()
        setSheetNames(Object.keys(result.data || {}))
      } catch (error) {
        console.error('Failed to fetch sheet names:', error)
      }
    }

    fetchSheets()
  }, [])

  // Fetch data for the selected sheet
  useEffect(() => {
    if (!selectedSheet || selectedSheet === lastLoadedSheetRef.current) return

    setLoading(true)

    const fetchSheetData = async () => {
      try {
        const response = await fetch(`${Base_url}excel-data/`)
        const result = await response.json()

        const sheetItems = result.data[selectedSheet]
        const sheetProducts: Product[] = (sheetItems as any[]).map(
          (item, index) => ({
            id: item['Item Code'] || `${selectedSheet}-${index}`,
            name: item['Description'],
            type: selectedSheet.toLowerCase().includes('subscription')
              ? 'subscription'
              : selectedSheet.toLowerCase().includes('service')
              ? 'service'
              : 'material',
            description: item['Description'],
            originalPrice: Number(item['Unit Price']),
            quantity: 1,
            unit: 'pcs',
            selected: selectedProducts.some(
              (sp) => sp.id === item['Item Code']
            ),
          })
        )

        setProducts(sheetProducts)
        lastLoadedSheetRef.current = selectedSheet // ✅ Update last loaded sheet
      } catch (error) {
        console.error('Failed to fetch sheet data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSheetData()
  }, [selectedSheet, selectedProducts])

  const handleProductSelect = (product: Product) => {
    const isAlreadySelected = selectedProducts.find((p) => p.id === product.id)
    let updatedSelections: Product[]

    if (isAlreadySelected) {
      updatedSelections = selectedProducts.filter((p) => p.id !== product.id)
    } else {
      updatedSelections = [...selectedProducts, { ...product, selected: true }]
    }

    onProductsChange(updatedSelections)

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, selected: !p.selected } : p
      )
    )
  }

  const handleProductUpdate = (updatedProduct: Product) => {
    const updatedProducts = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    )
    setProducts(updatedProducts)

    const updatedSelections = selectedProducts.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    )
    onProductsChange(updatedSelections)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredProducts = products.filter((product) => {
    const name = product.name || ''
    const description = product.description || ''
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === 'all') return matchesSearch
    return product.type === activeFilter && matchesSearch
  })

  const clearSelections = () => {
    const updatedProducts = products.map((p) => ({ ...p, selected: false }))
    setProducts(updatedProducts)
    onProductsChange([])
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sheet Selector */}
      <div className="mb-4">
        <label htmlFor="sheet-select" className="block mb-1 font-medium">
          Select Category
        </label>
        <select
          id="sheet-select"
          className="border rounded px-3 py-2"
          onChange={(e) => setSelectedSheet(e.target.value)}
          value={selectedSheet || ''}
        >
          <option value="" disabled>
            Select a sheet...
          </option>
          {sheetNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Select Products</h2>
        <p className="text-muted-foreground">
          Choose the products, services, or subscriptions to include in your
          offer.
        </p>
      </div>

      {/* Search & View Mode */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search products..."
            className="pl-10 w-full rounded-lg border border-input bg-background py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex p-1 bg-muted rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm'
                  : 'text-muted-foreground'
              } transition-colors`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm'
                  : 'text-muted-foreground'
              } transition-colors`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'material', 'subscription', 'service'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1 text-sm rounded-full transition-colors ${
              activeFilter === filter
                ? 'bg-brand-100 text-brand-800 border border-brand-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Selected Summary */}
      <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-brand-800">
              {selectedProducts.length} product
              {selectedProducts.length !== 1 ? 's' : ''} selected
            </span>
            <p className="text-sm text-brand-600">
              Total value: $
              {selectedProducts
                .reduce(
                  (sum, product) =>
                    sum +
                    (product.modifiedPrice || product.originalPrice) *
                      product.quantity,
                  0
                )
                .toFixed(2)}
            </p>
          </div>
          <button
            className="text-sm text-brand-700 hover:text-brand-800 underline"
            onClick={clearSelections}
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }
      >
        {loading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            No products found.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              onSelect={() => handleProductSelect(product)}
              onUpdate={handleProductUpdate}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default ProductSelection
