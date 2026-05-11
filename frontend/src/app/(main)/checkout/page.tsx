'use client'

import { withAuth } from '@shared/components/withAuth'
import { useCheckout } from '@features/orders/hooks/useCheckout'
import { ShippingForm } from '@features/orders/components/ShippingForm'
import { OrderPreviewStep } from '@features/orders/components/OrderPreviewStep'
import { OrderSuccessStep } from '@features/orders/components/OrderSuccessStep'

const STEPS = ['Envío', 'Resumen', 'Confirmado']

function CheckoutPage() {
  const { step, preview, order, isLoading, error, submitShipping, confirmOrder, goBack } = useCheckout()

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-lg mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-text font-display">Checkout</h1>

          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={[
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-display',
                      i < step
                        ? 'bg-primary text-white'
                        : i === step
                        ? 'bg-primary text-white ring-2 ring-primary-light ring-offset-2 ring-offset-bg'
                        : 'bg-surface text-text-subtle border border-border',
                    ].join(' ')}
                  >
                    {i < step ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={[
                      'text-sm font-medium font-display',
                      i === step ? 'text-text' : 'text-text-muted',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={['flex-1 h-px w-6', i < step ? 'bg-primary' : 'bg-border'].join(' ')} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-text font-display">Datos de envío</h2>
              <ShippingForm onSubmit={submitShipping} isLoading={isLoading} error={error} />
            </div>
          )}

          {step === 1 && preview && (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-text font-display">Resumen del pedido</h2>
              <OrderPreviewStep
                preview={preview}
                onConfirm={confirmOrder}
                onBack={goBack}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )}

          {step === 2 && order && <OrderSuccessStep order={order} />}
        </div>
      </div>
    </div>
  )
}

export default withAuth(CheckoutPage)
