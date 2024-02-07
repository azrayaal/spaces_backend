import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Spaces } from "./Space";
import { Replies } from "./Replies";

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

  @OneToMany(() => Spaces, (spaces) => spaces.user)
  spaces: Spaces;

  @OneToMany(() => Replies, (replies) => replies.user)
  replies: Replies;
}
