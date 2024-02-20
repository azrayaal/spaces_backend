import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";
import { User } from "./User";
import { Spaces } from "./Space";

@Entity()
export class Replies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Replies, (replies) => replies.user)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Replies, (replies) => replies.spaces)
  @JoinColumn({ name: "spaceId" })
  spaces: Spaces;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
