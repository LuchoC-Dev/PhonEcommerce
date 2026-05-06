import bcrypt from 'bcryptjs'

export interface IHashService {
  hash(plain: string): Promise<string>
  compare(plain: string, hashed: string): Promise<boolean>
}

export class BcryptHashService implements IHashService {
  private readonly saltRounds = 12

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds)
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed)
  }
}
