import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
@Index(["follower", "following", "created_at"], { unique: true })
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.follower)
  @JoinColumn({ name: "followerId" })
  follower: User;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: "followingId" })
  following: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
