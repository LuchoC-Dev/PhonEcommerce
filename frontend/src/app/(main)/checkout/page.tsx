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
    <div className="min-h-screen bg-[--color-bg] py-12 px-4">
      <div className="max-w-lg mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[--color-text] font-[--font-display]">Checkout</h1>

          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={[
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-[--font-display]',
                      i < step
                        ? 'bg-[--color-primary] text-white'
                        : i === step
                        ? 'bg-[--color-primary] text-white ring-2 ring-[--color-primary-light] ring-offset-2 ring-offset-[--color-bg]'
                        : 'bg-[--color-surface] text-[--color-text-subtle] border border-[--color-border]',
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
                      'text-sm font-medium font-[--font-display]',
                      i === step ? 'text-[--color-text]' : 'text-[--color-text-muted]',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={['flex-1 h-px w-6', i < step ? 'bg-[--color-primary]' : 'bg-[--color-border]'].join(' ')} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[--color-card] border border-[--color-border] rounded-[--radius-xl] p-6">
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-[--color-text] font-[--font-display]">Datos de envío</h2>
              <ShippingForm onSubmit={submitShipping} isLoading={isLoading} error={error} />
            </div>
          )}

          {step === 1 && preview && (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-[--color-text] font-[--font-display]">Resumen del pedido</h2>
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
