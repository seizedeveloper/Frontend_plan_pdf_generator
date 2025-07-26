import { useState, useEffect, useRef } from 'react'
// import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Product } from '../types'
// import html2pdf from 'html2pdf.js'
import autoTable from 'jspdf-autotable'
import { generateOfferPdf } from './GenerateOfferPDF'


interface OfferReviewProps {
  products: Product[]
  details: {
    clientName: string
    clientEmail: string
    offerName: string
    expirationDate: Date | null
    notes: string
  }
}

const OfferReview = ({
  products: initialProducts,
  details,
}: OfferReviewProps) => {
  const pdfRef = useRef(null)
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  )
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    if (pdfStatus !== 'idle') {
      setShowStatus(true)
      const timer = setTimeout(() => {
        setShowStatus(false)
        setPdfStatus('idle')
      }, 3000) // Hide after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [pdfStatus])

  const handleDescriptionChange = (id: string, value: string) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, modifiedDescription: value } : p
      )
    )
  }

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseFloat(value) || 0
    setProducts(products.map((p) => (p.id === id ? { ...p, quantity } : p)))
  }

  const handlePriceChange = (id: string, value: string) => {
    const modifiedPrice = parseFloat(value) || 0
    setProducts(
      products.map((p) => (p.id === id ? { ...p, modifiedPrice } : p))
    )
  }

  const calculateSubtotal = () => {
    return products.reduce(
      (total, product) =>
        total +
        (product.modifiedPrice || product.originalPrice) * product.quantity,
      0
    )
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discounted = subtotal - (subtotal * discount) / 100
    const taxed = discounted + (discounted * tax) / 100
    return taxed
  }

  const generatePDF = () => {
  try {
    generateOfferPdf(products, {
      ...details,
      discount,
      tax
    });
    setPdfStatus('success');
  } catch (err) {
    console.error('PDF generation failed:', err);
    setPdfStatus('error');
  }
};


  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary & Info */}
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-medium">
          {details.offerName || 'Custom Offer'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Client</p>
            <p className="font-medium">
              {details.clientName || 'Not specified'}
            </p>
            {details.clientEmail && <p>{details.clientEmail}</p>}
          </div>

          <div>
            <p className="text-muted-foreground">Valid Until</p>
            <p className="font-medium">
              {details.expirationDate
                ? new Date(details.expirationDate).toLocaleDateString()
                : 'No expiration date'}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium mb-4">Selected Products and Services</h4>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 text-left font-medium">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-left">
                      <input
                        className="w-full border p-1"
                        value={
                          product.modifiedDescription !== undefined
                            ? product.modifiedDescription
                            : product.description
                        }
                        onChange={(e) =>
                          handleDescriptionChange(product.id, e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        className="w-16 border text-right p-1"
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                      />{' '}
                      {product.unit || ''}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        className="w-20 border text-right p-1"
                        type="number"
                        value={product.modifiedPrice || product.originalPrice}
                        onChange={(e) =>
                          handlePriceChange(product.id, e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      €
                      {(
                        (product.modifiedPrice || product.originalPrice) *
                        product.quantity
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-300">
                <tr>
                
                  <td
                    colSpan={4}
                    className="px-4 py-3 text-right font-semibold"
                  >
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-brand-700">
                    €{calculateSubtotal().toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right text-sm font-medium">
                    Discount (%)
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="text" 
                      inputMode="numeric" 
                      className="w-20 border p-1 text-right"
                      value={discount.toString()}
                      onChange={(e) => {
                        let val = e.target.value
                        val = val.replace(/[^\d]/g, '')
                        val = val.replace(/^0+(?!$)/, '')

                        setDiscount(val === '' ? 0 : parseInt(val))
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right text-sm font-medium">
                    Tax (%)
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-20 border p-1 text-right"
                      value={tax.toString()}
                      onChange={(e) => {
                        let val = e.target.value
                        val = val.replace(/[^\d]/g, '')
                        val = val.replace(/^0+(?!$)/, '')
                        setTax(val === '' ? 0 : parseInt(val))
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right font-semibold">
                    Final Total
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-brand-700">
                    €{calculateTotal().toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {details.notes && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium mb-2">Additional Notes</h4>
            <div className="bg-white border border-gray-200 rounded p-4 text-sm">
              <p className="whitespace-pre-wrap">{details.notes}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 bg-brand-50 border border-brand-100 rounded-lg p-6 text-center">
        <h3 className="font-medium text-brand-800">
          Ready to generate your offer?
        </h3>
        <p className="text-sm text-brand-600 max-w-md">
          Your customized offer will be exported as a PDF document that you can
          share with your client.
        </p>
        <button
          className="bg-brand-600 hover:bg-brand-700 text-white py-2 px-6 rounded-md transition-colors"
          onClick={generatePDF}
        >
          Generate PDF
        </button>

        {showStatus && (
          <p
            className={`text-sm mt-2 ${pdfStatus === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {pdfStatus === 'success'
              ? 'PDF downloaded successfully!'
              : 'Failed to download PDF. Please try again.'}
          </p>
        )}
      </div>
      {/* <div style={{ display: 'none' }}>
        <OfferPdfTemplate ref={pdfRef} products={products} details={details} />
      </div> */}
    </div>


  )
}

export default OfferReview


