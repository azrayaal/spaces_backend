import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigrations1714275459514 implements MigrationInterface {
    name = 'MyMigrations1714275459514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "replies" ("id" SERIAL NOT NULL, "content" character varying, "image" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "spaceId" integer, CONSTRAINT "PK_08f619ebe431e27e9d206bea132" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "spacesId" integer, CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "spaces" ("id" SERIAL NOT NULL, "content" character varying, "image" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_dbe542974aca57afcb60709d4c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "follow" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "followerId" integer, "followingId" integer, CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f7c6c6c83e69b82a7073482752" ON "follow" ("followerId", "followingId", "created_at") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profile_picture" character varying NOT NULL, "profile_description" character varying NOT NULL, "header" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "replies" ADD CONSTRAINT "FK_e2877ab282e45ccfd2b2d0fd20e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "replies" ADD CONSTRAINT "FK_c4204fb5d886d073de82831000f" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_552fd4d9f7bb0440880033b201f" FOREIGN KEY ("spacesId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "spaces" ADD CONSTRAINT "FK_533cbce0a78fc63c5f012d1922b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_e9f68503556c5d72a161ce38513" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_e9f68503556c5d72a161ce38513"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_550dce89df9570f251b6af2665a"`);
        await queryRunner.query(`ALTER TABLE "spaces" DROP CONSTRAINT "FK_533cbce0a78fc63c5f012d1922b"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_552fd4d9f7bb0440880033b201f"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`ALTER TABLE "replies" DROP CONSTRAINT "FK_c4204fb5d886d073de82831000f"`);
        await queryRunner.query(`ALTER TABLE "replies" DROP CONSTRAINT "FK_e2877ab282e45ccfd2b2d0fd20e"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f7c6c6c83e69b82a7073482752"`);
        await queryRunner.query(`DROP TABLE "follow"`);
        await queryRunner.query(`DROP TABLE "spaces"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "replies"`);
    }

}
