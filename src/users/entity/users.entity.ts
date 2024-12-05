import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  constructor() {
    console.log('UserEntity is working');
  }

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty({ default: 100 })
  @Column({ default: 100 })
  balance?: number;

  @ApiProperty({ default: 'client' })
  @Column({ default: 'client' })
  role?: string;
}
