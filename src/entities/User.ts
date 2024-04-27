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

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  profile_description: string;

  @Column({ nullable: true })
  header: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => Spaces, (spaces) => spaces.user)
  spaces: Spaces[];

  @OneToMany(() => Replies, (replies) => replies.user)
  replies: Replies[];

  @OneToMany(() => Likes, (likes) => likes.user)
  likes: Likes[];

  @OneToMany(() => Follow, (follow) => follow.following)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  follower: Follow[];
}
