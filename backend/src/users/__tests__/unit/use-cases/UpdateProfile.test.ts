import { describe, it, expect, vi } from 'vitest'
import { UpdateProfile } from '../../../application/use-cases/UpdateProfile'
import { IUserRepository } from '../../../domain/repositories/user.repository'
import { NotFoundError } from '@shared/errors/AppError'
import { Profile, ProfileWithAddresses } from '../../../domain/entities/user.entity'

const mockProfile: ProfileWithAddresses = {
  id: 'prof-1',
  name: 'Test User',
  avatar: null,
  phone: null,
  bio: null,
  accountId: 'acc-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  addresses: [],
}

const updatedProfile: Profile = { ...mockProfile, name: 'Updated Name', bio: 'Hello' }

function makeRepo(overrides?: Partial<IUserRepository>): IUserRepository {
  return {
    findProfileByAccountId: vi.fn().mockResolvedValue(mockProfile),
    createProfile: vi.fn(),
    updateProfile: vi.fn().mockResolvedValue(updatedProfile),
    findAddressById: vi.fn(),
    addAddress: vi.fn(),
    updateAddress: vi.fn(),
    deleteAddress: vi.fn(),
    setDefaultAddress: vi.fn(),
    ...overrides,
  }
}

describe('UpdateProfile', () => {
  it('updates and returns profile', async () => {
    const useCase = new UpdateProfile(makeRepo())
    const result = await useCase.execute('acc-1', { name: 'Updated Name', bio: 'Hello' })

    expect(result.name).toBe('Updated Name')
    expect(result.bio).toBe('Hello')
  })

  it('throws NotFoundError when profile does not exist', async () => {
    const useCase = new UpdateProfile(makeRepo({ findProfileByAccountId: vi.fn().mockResolvedValue(null) }))

    await expect(useCase.execute('acc-missing', { name: 'X' })).rejects.toThrow(NotFoundError)
  })
})
