import { IUserRepository, UpdateProfileData } from '../../domain/repositories/user.repository'
import { Profile } from '../../domain/entities/user.entity'
import { NotFoundError } from '@shared/errors/AppError'

export class UpdateProfile {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(accountId: string, data: UpdateProfileData): Promise<Profile> {
    const existing = await this.userRepository.findProfileByAccountId(accountId)
    if (!existing) throw new NotFoundError('Profile')
    return this.userRepository.updateProfile(accountId, data)
  }
}
