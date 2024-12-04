import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  constructor() {
    console.log('UserEntity is working');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 100 })
  balance?: number;

  @Column({ default: 'client' })
  role?: string;
}
