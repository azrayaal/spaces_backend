import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Spaces } from "./Space";

@Entity()
export class Replies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Replies, (replies) => replies.user)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Replies, (replies) => replies.spaces)
  @JoinColumn({ name: "spaceId" })
  spaces: Spaces;
}
