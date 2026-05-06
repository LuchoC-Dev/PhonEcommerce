import { IUserRepository } from '../../domain/repositories/user.repository'
import { ProfileWithAddresses } from '../../domain/entities/user.entity'
import { NotFoundError } from '@shared/errors/AppError'

export class GetProfile {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(accountId: string): Promise<ProfileWithAddresses> {
    const profile = await this.userRepository.findProfileByAccountId(accountId)
    if (!profile) throw new NotFoundError('Profile')
    return profile
  }
}
