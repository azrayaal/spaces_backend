import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  profile_picture: string;

  @Column()
  profile_description: string;
}
