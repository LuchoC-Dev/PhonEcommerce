'use client'

import { useAuthStore } from '@features/auth/store/auth.store'
import { withAuth } from '@shared/components/withAuth'
import { Card, CardHeader, CardTitle } from '@shared/components/Card'
import { PageSpinner } from '@shared/components/Spinner'
import { ProfileForm } from '@features/profile/components/ProfileForm'
import { AddressList } from '@features/profile/components/AddressList'
import { useProfile } from '@features/profile/hooks/useProfile'
import { useAddresses } from '@features/profile/hooks/useAddresses'

function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const { profile, addresses, setAddresses, isLoading, error, updateProfile } = useProfile()
  const {
    addAddress,
    updateAddress,
    deleteAddress,
    isLoading: addressesLoading,
  } = useAddresses(addresses, setAddresses)

  if (isLoading) {
    return <PageSpinner />
  }

  if (error) {
    return (
      <div className="space-y-8">
        <Card>
          <p className="text-[#f87171] text-center py-4">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold font-[--font-display] text-[--color-text]">
          Mi perfil
        </h1>
        <p className="text-sm text-[#94a3b8] mt-1">{user?.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <ProfileForm profile={profile} onSave={updateProfile} />
      </Card>

      <Card>
        <AddressList
          addresses={addresses}
          onAdd={addAddress}
          onUpdate={updateAddress}
          onDelete={deleteAddress}
          isLoading={addressesLoading}
        />
      </Card>
    </div>
  )
}

export default withAuth(ProfilePage)