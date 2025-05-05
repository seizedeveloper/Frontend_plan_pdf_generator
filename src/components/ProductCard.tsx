import { useState } from 'react'
import { Product } from '../types'
import { Check, Edit, Plus, Minus } from 'lucide-react'

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  onSelect: () => void
  onUpdate: (product: Product) => void
}

const ProductCard = ({
  product,
  viewMode,
  onSelect,
  onUpdate,
}: ProductCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPrice, setEditedPrice] = useState<string>(
    (product.modifiedPrice || product.originalPrice).toString()
  )
  const [editedDescription, setEditedDescription] = useState<string>(
    product.modifiedDescription || product.description
  )
  const [quantity, setQuantity] = useState<number>(product.quantity)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedPrice((product.modifiedPrice || product.originalPrice).toString())
    setEditedDescription(product.modifiedDescription || product.description)
    setQuantity(product.quantity)
  }

  const handleSave = () => {
    const newPrice = parseFloat(editedPrice)
    const updatedProduct = {
      ...product,
      modifiedPrice: isNaN(newPrice) ? product.originalPrice : newPrice,
      modifiedDescription: editedDescription,
      quantity: quantity,
    }
    onUpdate(updatedProduct)
    setIsEditing(false)
  }

  const incrementQuantity = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    if (!isEditing && product.selected) {
      onUpdate({
        ...product,
        quantity: newQuantity,
      })
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      if (!isEditing && product.selected) {
        onUpdate({
          ...product,
          quantity: newQuantity,
        })
      }
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'material':
        return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'subscription':
        return 'bg-purple-50 text-purple-700 border-purple-100'
      case 'service':
        return 'bg-green-50 text-green-700 border-green-100'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100'
    }
  }

  return (
    <div
      className={`offer-card relative hover:shadow-lg transition-shadow border ${
        product.selected ? 'border-brand-300 bg-brand-50' : 'border-gray-100'
      } overflow-hidden`}
    >
      {product.selected && (
        <div className="absolute top-2 right-2 bg-brand-500 text-white rounded-full p-1">
          <Check size={14} />
        </div>
      )}

      <div className={viewMode === 'grid' ? '' : 'flex gap-4'}>
        <div className={`${viewMode === 'grid' ? 'mb-3' : 'min-w-[120px]'}`}>
          <div
            className={`text-xs font-medium py-1 px-2 rounded inline-block mb-2 ${getTypeColor(
              product.type
            )}`}
          >
            {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
          </div>
          <h3 className="font-medium">{product.name}</h3>
        </div>

        <div className="flex-grow">
          {isEditing ? (
            <div className="space-y-3">
              {/* Description edit */}
              <div>
                <label className="text-xs text-gray-500">Description</label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm"
                  rows={2}
                />
              </div>

              {/* Price edit */}
              <div className="flex items-center">
                <label className="text-xs text-gray-500 w-16">Price</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                    className="border rounded-md py-1 px-4 pl-6 text-sm w-24"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-xs bg-brand-600 text-white rounded-md hover:bg-brand-700"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">
                {product.modifiedDescription || product.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brand-700">
                    $
                    {(product.modifiedPrice || product.originalPrice).toFixed(
                      2
                    )}
                    {product.unit && (
                      <span className="text-xs text-gray-500 ml-1">
                        /{product.unit}
                      </span>
                    )}
                  </p>
                  {product.modifiedPrice && (
                    <p className="text-xs text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {product.selected && (
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={decrementQuantity}
                        className="p-1 hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}

                  {product.selected ? (
                    <button
                      onClick={handleEdit}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                      <Edit size={14} />
                    </button>
                  ) : null}

                  <button
                    onClick={onSelect}
                    className={`px-3 py-1 text-sm rounded-md ${
                      product.selected
                        ? 'bg-brand-50 text-brand-700 border border-brand-200'
                        : 'bg-brand-600 text-white hover:bg-brand-700'
                    }`}
                  >
                    {product.selected ? 'Remove' : 'Add'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
