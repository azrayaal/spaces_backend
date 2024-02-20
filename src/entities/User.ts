import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Spaces } from "./Space";
import { Replies } from "./Replies";
import { Likes } from "./Likes";
import { Follow } from "./Follow";

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

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => Spaces, (spaces) => spaces.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  spaces: Spaces[];

  @OneToMany(() => Replies, (replies) => replies.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  replies: Replies[];

  @OneToMany(() => Likes, (likes) => likes.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  likes: Likes[];

  @OneToMany(() => Follow, (follow) => follow.following, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  follower: Follow[];
}
