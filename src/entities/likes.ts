import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Spaces } from "./Space";

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Spaces, (spaces) => spaces.likes)
  @JoinColumn({ name: "spacesId" })
  spaces: Spaces;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
