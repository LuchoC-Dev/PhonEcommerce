import { PrismaClient } from '@prisma/client'
import {
  IUserRepository,
  CreateProfileData,
  UpdateProfileData,
  AddressData,
} from '../../domain/repositories/user.repository'
import { Profile, Address, ProfileWithAddresses } from '../../domain/entities/user.entity'

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findProfileByAccountId(accountId: string): Promise<ProfileWithAddresses | null> {
    return this.prisma.profile.findUnique({
      where: { accountId },
      include: { addresses: { orderBy: { isDefault: 'desc' } } },
    })
  }

  async createProfile(data: CreateProfileData): Promise<Profile> {
    return this.prisma.profile.create({ data })
  }

  async updateProfile(accountId: string, data: UpdateProfileData): Promise<Profile> {
    return this.prisma.profile.update({
      where: { accountId },
      data,
    })
  }

  async findAddressById(id: string): Promise<Address | null> {
    return this.prisma.address.findUnique({ where: { id } })
  }

  async addAddress(profileId: string, data: AddressData): Promise<Address> {
    // If this is the first address or isDefault is set, handle default logic
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { profileId, isDefault: true },
        data: { isDefault: false },
      })
    }

    // If it's the first address, make it default automatically
    const count = await this.prisma.address.count({ where: { profileId } })
    const isDefault = data.isDefault ?? count === 0

    return this.prisma.address.create({
      data: { ...data, profileId, isDefault },
    })
  }

  async updateAddress(id: string, data: Partial<AddressData>): Promise<Address> {
    return this.prisma.address.update({ where: { id }, data })
  }

  async deleteAddress(id: string): Promise<void> {
    await this.prisma.address.delete({ where: { id } })
  }

  async setDefaultAddress(addressId: string, profileId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.address.updateMany({
        where: { profileId, isDefault: true },
        data: { isDefault: false },
      }),
      this.prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ])
  }
}
