import { IUserRepository, AddressData } from '../../domain/repositories/user.repository'
import { Address } from '../../domain/entities/user.entity'
import { NotFoundError, ForbiddenError } from '@shared/errors/AppError'

export class UpdateAddress {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    accountId: string,
    addressId: string,
    data: Partial<AddressData>,
  ): Promise<Address> {
    const profile = await this.userRepository.findProfileByAccountId(accountId)
    if (!profile) throw new NotFoundError('Profile')

    const address = await this.userRepository.findAddressById(addressId)
    if (!address) throw new NotFoundError('Address')
    if (address.profileId !== profile.id) throw new ForbiddenError('Address does not belong to this user')

    if (data.isDefault) {
      await this.userRepository.setDefaultAddress(addressId, profile.id)
    }

    return this.userRepository.updateAddress(addressId, data)
  }
}
