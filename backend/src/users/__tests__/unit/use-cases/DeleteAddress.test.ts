import { describe, it, expect, vi } from 'vitest'
import { DeleteAddress } from '../../../application/use-cases/DeleteAddress'
import { IUserRepository } from '../../../domain/repositories/user.repository'
import { NotFoundError, ForbiddenError } from '@shared/errors/AppError'
import { Address, ProfileWithAddresses } from '../../../domain/entities/user.entity'

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

const mockAddress: Address = {
  id: 'addr-1',
  street: 'Av. Corrientes 1234',
  city: 'Buenos Aires',
  state: null,
  country: 'Argentina',
  zipCode: '1043',
  isDefault: true,
  profileId: 'prof-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

function makeRepo(overrides?: Partial<IUserRepository>): IUserRepository {
  return {
    findProfileByAccountId: vi.fn().mockResolvedValue(mockProfile),
    createProfile: vi.fn(),
    updateProfile: vi.fn(),
    findAddressById: vi.fn().mockResolvedValue(mockAddress),
    addAddress: vi.fn(),
    updateAddress: vi.fn(),
    deleteAddress: vi.fn().mockResolvedValue(undefined),
    setDefaultAddress: vi.fn(),
    ...overrides,
  }
}

describe('DeleteAddress', () => {
  it('deletes address when it belongs to the user', async () => {
    const repo = makeRepo()
    const useCase = new DeleteAddress(repo)

    await useCase.execute('acc-1', 'addr-1')

    expect(repo.deleteAddress).toHaveBeenCalledWith('addr-1')
  })

  it('throws NotFoundError when profile does not exist', async () => {
    const useCase = new DeleteAddress(makeRepo({ findProfileByAccountId: vi.fn().mockResolvedValue(null) }))

    await expect(useCase.execute('acc-missing', 'addr-1')).rejects.toThrow(NotFoundError)
  })

  it('throws NotFoundError when address does not exist', async () => {
    const useCase = new DeleteAddress(makeRepo({ findAddressById: vi.fn().mockResolvedValue(null) }))

    await expect(useCase.execute('acc-1', 'addr-missing')).rejects.toThrow(NotFoundError)
  })

  it('throws ForbiddenError when address belongs to another user', async () => {
    const useCase = new DeleteAddress(
      makeRepo({ findAddressById: vi.fn().mockResolvedValue({ ...mockAddress, profileId: 'other-prof' }) }),
    )

    await expect(useCase.execute('acc-1', 'addr-1')).rejects.toThrow(ForbiddenError)
  })
})
