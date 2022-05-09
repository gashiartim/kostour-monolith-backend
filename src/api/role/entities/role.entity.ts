import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @OneToMany((type) => User, (user) => user.role)
  users: Promise<User[]>;

  @ManyToMany((type) => Permission)
  @JoinTable()
  permissions: Permission[];

  isAdmin() {
    return this.slug == 'admin';
  }
}
