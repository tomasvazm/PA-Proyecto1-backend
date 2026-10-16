import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModoDenominacionToProducto1792180000000
  implements MigrationInterface
{
  name = 'AddModoDenominacionToProducto1792180000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `producto` ADD `modoDenominacion` varchar(10) NOT NULL DEFAULT 'MANUAL'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `producto` DROP COLUMN `modoDenominacion`',
    );
  }
}
