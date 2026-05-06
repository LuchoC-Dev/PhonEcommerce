import { IUserRepository } from '../../domain/repositories/user.repository'
import { NotFoundError, ForbiddenError } from '@shared/errors/AppError'

export class DeleteAddress {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(accountId: string, addressId: string): Promise<void> {
    const profile = await this.userRepository.findProfileByAccountId(accountId)
    if (!profile) throw new NotFoundError('Profile')

    const address = await this.userRepository.findAddressById(addressId)
    if (!address) throw new NotFoundError('Address')
    if (address.profileId !== profile.id) throw new ForbiddenError('Address does not belong to this user')

    await this.userRepository.deleteAddress(addressId)
  }
}
