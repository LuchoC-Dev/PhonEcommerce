import api from '@shared/lib/api'
import type {
  ProfileWithAddresses,
  Profile,
  Address,
  UpdateProfilePayload,
  AddressPayload,
} from '../types/profile.types'

export const profileService = {
  async getProfile(): Promise<ProfileWithAddresses> {
    const { data } = await api.get<ProfileWithAddresses>('/users/profile')
    return data
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
    const { data } = await api.put<Profile>('/users/profile', payload)
    return data
  },

  async addAddress(payload: AddressPayload): Promise<Address> {
    const { data } = await api.post<Address>('/users/addresses', payload)
    return data
  },

  async updateAddress(id: string, payload: Partial<AddressPayload>): Promise<Address> {
    const { data } = await api.put<Address>(`/users/addresses/${id}`, payload)
    return data
  },

  async deleteAddress(id: string): Promise<void> {
    await api.delete(`/users/addresses/${id}`)
  },
}
