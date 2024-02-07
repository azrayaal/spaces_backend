import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1707282142400 implements MigrationInterface {
    name = 'MyMigration1707282142400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "spaces" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "image" character varying NOT NULL, "posted_at" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_dbe542974aca57afcb60709d4c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "spaces" ADD CONSTRAINT "FK_533cbce0a78fc63c5f012d1922b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spaces" DROP CONSTRAINT "FK_533cbce0a78fc63c5f012d1922b"`);
        await queryRunner.query(`DROP TABLE "spaces"`);
    }

}
