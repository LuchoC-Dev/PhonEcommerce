import { IUserRepository, AddressData } from '../../domain/repositories/user.repository'
import { Address } from '../../domain/entities/user.entity'
import { NotFoundError } from '@shared/errors/AppError'

export class AddAddress {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(accountId: string, data: AddressData): Promise<Address> {
    const profile = await this.userRepository.findProfileByAccountId(accountId)
    if (!profile) throw new NotFoundError('Profile')
    return this.userRepository.addAddress(profile.id, data)
  }
}
