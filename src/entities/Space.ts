import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";

import { User } from "./User";
import { Replies } from "./Replies";
import { Likes } from "./Likes";

@Entity()
export class Spaces {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.spaces, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => Replies, (replies) => replies.spaces)
  replies: Replies[];

  @OneToMany(() => Likes, (likes) => likes.spaces)
  likes: Likes[];
}
