import { describe, it, expect, vi } from 'vitest'
import { GetProfile } from '../../../application/use-cases/GetProfile'
import { IUserRepository } from '../../../domain/repositories/user.repository'
import { NotFoundError } from '@shared/errors/AppError'
import { ProfileWithAddresses } from '../../../domain/entities/user.entity'

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

function makeRepo(overrides?: Partial<IUserRepository>): IUserRepository {
  return {
    findProfileByAccountId: vi.fn().mockResolvedValue(mockProfile),
    createProfile: vi.fn(),
    updateProfile: vi.fn(),
    findAddressById: vi.fn(),
    addAddress: vi.fn(),
    updateAddress: vi.fn(),
    deleteAddress: vi.fn(),
    setDefaultAddress: vi.fn(),
    ...overrides,
  }
}

describe('GetProfile', () => {
  it('returns profile when found', async () => {
    const useCase = new GetProfile(makeRepo())
    const result = await useCase.execute('acc-1')

    expect(result).toEqual(mockProfile)
  })

  it('throws NotFoundError when profile does not exist', async () => {
    const useCase = new GetProfile(makeRepo({ findProfileByAccountId: vi.fn().mockResolvedValue(null) }))

    await expect(useCase.execute('acc-missing')).rejects.toThrow(NotFoundError)
  })
})
