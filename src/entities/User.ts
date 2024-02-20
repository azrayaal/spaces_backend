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

  @OneToMany(() => Spaces, (spaces) => spaces.user, { cascade: true })
  spaces: Spaces;

  @OneToMany(() => Replies, (replies) => replies.user, { cascade: true })
  replies: Replies;

  @OneToMany(() => Likes, (likes) => likes.user, { cascade: true })
  likes: Likes;

  @OneToMany(() => Follow, (follow) => follow.following, { cascade: true })
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower, { cascade: true })
  follower: Follow[];
}
