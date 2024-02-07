import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1707274232055 implements MigrationInterface {
    name = 'MyMigration1707274232055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profile_picture" character varying NOT NULL, "profile_description" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
