import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/user.entity';
import { getRepository } from 'typeorm';

export function hashPasswd(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export async function crerateUser({ email, username, password }): Promise<void> {
  const user = new User();
  user.email = email;
  user.username = username;

  const hash = hashPasswd(password);

  user.hash = hash;

  await getRepository(User).save(user);
}
