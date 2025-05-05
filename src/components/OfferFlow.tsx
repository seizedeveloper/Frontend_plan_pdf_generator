import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductSelection from './ProductSelection'
import OfferDetails from './OfferDetails'
import OfferReview from './OfferReview'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Product } from '@/types'

const steps = [
  { id: 1, name: 'Select Products' },
  { id: 2, name: 'Enter Details' },
  { id: 3, name: 'Review & Generate' },
]

const OfferFlow = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [offerDetails, setOfferDetails] = useState({
    clientName: '',
    clientEmail: '',
    offerName: '',
    expirationDate: null,
    notes: '',
  })

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleProductSelection = (products: Product[]) => {
    setSelectedProducts(products)
  }

  const handleDetailsChange = (details: any) => {
    setOfferDetails({ ...offerDetails, ...details })
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <nav aria-label="Progress" className="w-full max-w-xl">
          <ol className="flex items-center justify-between">
            {steps.map((step) => (
              <li key={step.id} className="relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      step.id === currentStep
                        ? 'border-brand-600 bg-brand-50 text-brand-600'
                        : step.id < currentStep
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      step.id <= currentStep
                        ? 'text-brand-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {step.id < steps.length && (
                  <div
                    className={`hidden sm:block absolute top-4 left-0 w-full h-0.5 ${
                      step.id < currentStep ? 'bg-brand-600' : 'bg-gray-200'
                    }`}
                    style={{ marginLeft: '50%', left: '50%', width: '100%' }}
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        {currentStep === 1 && (
          <ProductSelection
            selectedProducts={selectedProducts}
            onProductsChange={handleProductSelection}
          />
        )}
        {currentStep === 2 && (
          <OfferDetails
            details={offerDetails}
            onDetailsChange={handleDetailsChange}
          />
        )}
        {currentStep === 3 && (
          <OfferReview products={selectedProducts} details={offerDetails} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className={`flex items-center gap-1 px-4 py-2 rounded-md ${
            currentStep === 1
              ? 'invisible'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={nextStep}
          className={`flex items-center gap-1 px-4 py-2 rounded-md ${
            currentStep === steps.length
              ? 'bg-brand-700 text-white hover:bg-brand-800'
              : 'bg-brand-600 text-white hover:bg-brand-700'
          } transition-colors`}
        >
          <span>
            {currentStep === steps.length ? 'Generate PDF' : 'Continue'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default OfferFlow
