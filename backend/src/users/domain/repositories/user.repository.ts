import { Profile, Address, ProfileWithAddresses } from '../entities/user.entity'

export interface IUserRepository {
  // Profile
  findProfileByAccountId(accountId: string): Promise<ProfileWithAddresses | null>
  createProfile(data: CreateProfileData): Promise<Profile>
  updateProfile(accountId: string, data: UpdateProfileData): Promise<Profile>

  // Address
  findAddressById(id: string): Promise<Address | null>
  addAddress(profileId: string, data: AddressData): Promise<Address>
  updateAddress(id: string, data: Partial<AddressData>): Promise<Address>
  deleteAddress(id: string): Promise<void>
  setDefaultAddress(addressId: string, profileId: string): Promise<void>
}

export interface CreateProfileData {
  name: string
  accountId: string
  avatar?: string
  phone?: string
  bio?: string
}

export interface UpdateProfileData {
  name?: string
  avatar?: string
  phone?: string
  bio?: string
}

export interface AddressData {
  street: string
  city: string
  state?: string
  country: string
  zipCode: string
  isDefault?: boolean
}
