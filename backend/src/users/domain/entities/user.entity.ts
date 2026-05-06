export interface Profile {
  id: string
  name: string
  avatar: string | null
  phone: string | null
  bio: string | null
  accountId: string
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
  updatedAt: Date
}

export interface ProfileWithAddresses extends Profile {
  addresses: Address[]
}
