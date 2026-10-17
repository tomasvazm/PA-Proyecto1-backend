import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHistorialPrecio1792210000000
  implements MigrationInterface
{
  name = 'CreateHistorialPrecio1792210000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`historial_precio\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`producto_id\` int NOT NULL,
        \`usuario_id\` int NOT NULL,
        \`precioAnterior\` decimal(15,5) NOT NULL,
        \`precioNuevo\` decimal(15,5) NOT NULL,
        \`fechaCambio\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`motivo\` varchar(500) NOT NULL,
        INDEX \`IDX_historial_precio_producto_id\` (\`producto_id\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_historial_precio_producto\`
          FOREIGN KEY (\`producto_id\`) REFERENCES \`producto\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT \`FK_historial_precio_usuario\`
          FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuario\`(\`id\`)
          ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `historial_precio`');
  }
}
