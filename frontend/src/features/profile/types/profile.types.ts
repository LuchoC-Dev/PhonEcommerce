export interface Profile {
  id: string
  name: string
  avatar: string | null
  phone: string | null
  bio: string | null
  accountId: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  street: string
  city: string
  state: string | null
  country: string
  zipCode: string
  isDefault: boolean
  profileId: string
  createdAt: string
  updatedAt: string
}

export interface ProfileWithAddresses extends Profile {
  addresses: Address[]
}

export interface UpdateProfilePayload {
  name?: string
  avatar?: string
  phone?: string
  bio?: string
}

export interface AddressPayload {
  street: string
  city: string
  state?: string
  country: string
  zipCode: string
  isDefault?: boolean
}
