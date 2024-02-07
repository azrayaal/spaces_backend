import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";

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
}
