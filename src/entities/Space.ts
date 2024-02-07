import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Replies } from "./Replies";

@Entity()
export class Spaces {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  image: string;

  @Column()
  posted_at: string;

  @ManyToOne(() => User, (user) => user.spaces)
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => Replies, (replies) => replies.spaces)
  spaces: Spaces;
}
