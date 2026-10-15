import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPresentacionToProducto1792040000000
  implements MigrationInterface
{
  name = 'AddPresentacionToProducto1792040000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `producto` ADD `presentacionCantidad` decimal(12,3) NULL, ADD `presentacionUnidad` varchar(16) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `producto` DROP COLUMN `presentacionUnidad`, DROP COLUMN `presentacionCantidad`',
    );
  }
}
