import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1728343307020 implements MigrationInterface {
    name = 'InitialMigration1728343307020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "credit_application" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "status" character varying NOT NULL, "studentId" integer, CONSTRAINT "PK_b213ac8b5ebc9d4d59110751adc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e" UNIQUE ("email"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "credit_application" ADD CONSTRAINT "FK_7b9bb5b667e3b12ba529874c4b8" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credit_application" DROP CONSTRAINT "FK_7b9bb5b667e3b12ba529874c4b8"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TABLE "credit_application"`);
    }

}
