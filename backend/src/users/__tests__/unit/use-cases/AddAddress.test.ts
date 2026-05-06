import { describe, it, expect, vi } from 'vitest'
import { AddAddress } from '../../../application/use-cases/AddAddress'
import { IUserRepository } from '../../../domain/repositories/user.repository'
import { NotFoundError } from '@shared/errors/AppError'
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
    findAddressById: vi.fn(),
    addAddress: vi.fn().mockResolvedValue(mockAddress),
    updateAddress: vi.fn(),
    deleteAddress: vi.fn(),
    setDefaultAddress: vi.fn(),
    ...overrides,
  }
}

const addressInput = { street: 'Av. Corrientes 1234', city: 'Buenos Aires', country: 'Argentina', zipCode: '1043' }

describe('AddAddress', () => {
  it('adds address to existing profile', async () => {
    const repo = makeRepo()
    const useCase = new AddAddress(repo)

    const result = await useCase.execute('acc-1', addressInput)

    expect(result).toEqual(mockAddress)
    expect(repo.addAddress).toHaveBeenCalledWith('prof-1', addressInput)
  })

  it('throws NotFoundError when profile does not exist', async () => {
    const useCase = new AddAddress(makeRepo({ findProfileByAccountId: vi.fn().mockResolvedValue(null) }))

    await expect(useCase.execute('acc-missing', addressInput)).rejects.toThrow(NotFoundError)
  })
})
